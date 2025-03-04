import { ITransformer } from './transformer.interface';
import { FieldType } from '../enums/field-type.enum';

interface ITransformableField {
  name: string;
  typeName: FieldType | string;
  fields?: ReadonlyArray<ITransformableField>;
}

export abstract class FieldTransformer {
  /**
   * Recursively traverses an object and applies a transformer function to specific fields
   *
   * @param obj - The object to transform
   * @param fields - Field definitions describing the path to transform
   * @param transformers - Array of Functions to apply to the target fields
   * @returns Transformed object
   */
  static traverseAndTransform<T>(
    obj: object,
    fields: ReadonlyArray<ITransformableField>,
    transformers: (new () => ITransformer)[],
  ): Record<string, any> {
    const transformerInstances = transformers.map(
      (TransformerClass) => new TransformerClass(),
    );

    return this.applyTransformers(obj, fields, transformerInstances);
  }

  private static applyTransformers(
    obj: object,
    fields: ReadonlyArray<ITransformableField>,
    transformers: ITransformer[],
  ): Record<string, any> {
    if (!obj) {
      return {};
    }

    if (Array.isArray(obj)) {
      return obj.map((item) =>
        this.applyTransformers(item, fields, transformers),
      );
    }

    const result: Record<string, any> = { ...obj };

    fields.forEach((f) => {
      const key = f.name;
      const type = f.typeName;

      if (f.fields?.length) {
        result[key] = this.applyTransformers(
          result[key],
          f.fields,
          transformers,
        );
      } else {
        transformers.forEach((t) => {
          if (t.type === type) {
            result[key] = t.transform(result[key]);
          }
        });
      }
    });

    return result;
  }
}

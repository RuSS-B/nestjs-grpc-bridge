import { FieldTransformer } from './field-transformer';
import { ITransformer } from './transformer.interface';
import { FieldType } from '../enums/field-type.enum';

class DoubleTransformer implements ITransformer {
  type = FieldType.UINT32;
  transform(value: number | null): number | null {
    return value === null ? null : value * 2;
  }
}

describe('FieldTransformer', () => {
  describe('traverseAndTransform', () => {
    it('should transform simple fields', () => {
      const obj = { a: 1, b: 2 };
      const fields = [
        {
          name: 'a',
          typeName: FieldType.UINT32,
        },
      ];

      const result = FieldTransformer.traverseAndTransform(obj, fields, [
        DoubleTransformer,
      ]);

      expect(result).toEqual({ a: 2, b: 2 });
    });

    it('should transform nested fields', () => {
      const obj = {
        metadata: {
          value: 5,
        },
        other: 1,
      };
      const fields = [
        {
          name: 'metadata',
          typeName: 'SomeNestedField',
          fields: [{ name: 'value', typeName: FieldType.UINT32 }],
        },
      ];

      const result = FieldTransformer.traverseAndTransform(obj, fields, [
        DoubleTransformer,
      ]);

      expect(result).toEqual({
        metadata: {
          value: 10,
        },
        other: 1,
      });
    });

    it('should transform arrays', () => {
      const obj = {
        items: [{ value: 1 }, { value: 2 }],
      };
      const fields = [
        {
          name: 'items',
          typeName: 'RepeatedField',
          fields: [{ name: 'value', typeName: FieldType.UINT32 }],
        },
      ];

      const result = FieldTransformer.traverseAndTransform(obj, fields, [
        DoubleTransformer,
      ]);

      expect(result).toEqual({
        items: [{ value: 2 }, { value: 4 }],
      });
    });

    it('should handle null values', () => {
      const obj = {
        metadata: null,
        value: 1,
      };
      const fields = [
        { name: 'metadata', typeName: FieldType.UINT32 },
        { name: 'value', typeName: FieldType.UINT32 },
      ];

      const result = FieldTransformer.traverseAndTransform(obj, fields, [
        DoubleTransformer,
      ]);

      expect(result).toEqual({
        metadata: null,
        value: 2,
      });
    });

    it('should not modify non-specified fields', () => {
      const obj = {
        keep: 1,
        transform: 2,
      };
      const fields = [{ name: 'transform', typeName: FieldType.UINT32 }];

      const result = FieldTransformer.traverseAndTransform(obj, fields, [
        DoubleTransformer,
      ]);

      expect(result.keep).toBe(1);
      expect(result.transform).toBe(4);
    });
  });
});

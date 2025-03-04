import { ITransformer } from './transformer.interface';
import { WellKnownType } from '../enums/well-known-type.enum';
import { Struct } from './struct';

export class StructToJsonTransformer implements ITransformer {
  type = WellKnownType.STRUCT;

  transform(value: any): object | undefined {
    return Struct.toObject(value);
  }
}

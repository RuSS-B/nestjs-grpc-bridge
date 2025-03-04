import { FieldType } from '../enums/field-type.enum';
import { WellKnownType } from '../enums/well-known-type.enum';

export interface ITransformer {
  type: FieldType | WellKnownType;
  transform: (value: any) => any;
}

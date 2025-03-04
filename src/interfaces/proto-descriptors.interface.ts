import { FieldLabel } from '../enums/field-label.enum';
import { FieldType } from '../enums/field-type.enum';

export interface FieldOptions {
  deprecated?: boolean;
  packed?: boolean;
  customOptions?: Record<string, unknown>;
}

export interface IFieldDescriptor {
  name: string;
  extendee: string;
  number: number;
  label: FieldLabel;
  type: FieldType;
  typeName: string;
  defaultValue: string | number | boolean;
  options: FieldOptions;
  oneofIndex: number;
  jsonName: string;
}

export type MessageDefinitionMap = ReadonlyMap<
  string,
  ReadonlyArray<IFieldDescriptor>
>;

export interface IMessageDefinition {
  field: IFieldDescriptor[];
}

export interface IMessageDescriptor {
  type: IMessageDefinition;
}

interface IDescriptorType {
  field: IFieldDescriptor[];
  nestedType: any[];
  enumType: any[];
  extensionRange: any[];
  extension: any[];
  oneofDecl: IOneofDecl[];
  reservedRange: any[];
  reservedName: any[];
  name: string;
  options: any;
}

interface IOneofDecl {
  name: string;
  options: any;
}

export enum FieldLabel {
  OPTIONAL = 'LABEL_OPTIONAL',
  REQUIRED = 'LABEL_REQUIRED',
  REPEATED = 'LABEL_REPEATED',
}

export enum FieldType {
  DOUBLE = 'TYPE_DOUBLE',
  FLOAT = 'TYPE_FLOAT',
  INT32 = 'TYPE_INT32',
  UINT32 = 'TYPE_UINT32',
  INT64 = 'TYPE_INT64',
  UINT64 = 'TYPE_UINT64',
  FIXED64 = 'TYPE_FIXED64',
  FIXED32 = 'TYPE_FIXED32',
  BOOL = 'TYPE_BOOL',
  STRING = 'TYPE_STRING',
  GROUP = 'TYPE_GROUP', // Legacy, not recommended
  MESSAGE = 'TYPE_MESSAGE',
  BYTES = 'TYPE_BYTES',
  ENUM = 'TYPE_ENUM',
  SFIXED32 = 'TYPE_SFIXED32',
  SFIXED64 = 'TYPE_SFIXED64',
  SINT32 = 'TYPE_SINT32',
  SINT64 = 'TYPE_SINT64',
}

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

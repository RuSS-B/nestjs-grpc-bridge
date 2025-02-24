import {
  FieldType,
  IFieldDescriptor,
  IFoundField,
  MessageDefinitionMap,
} from './interfaces';

export class FieldSelector {
  constructor(
    private readonly fields: IFieldDescriptor[],
    private readonly messageTypes: MessageDefinitionMap,
    private readonly packageName: string = '',
  ) {}

  findFieldsByType(
    typeName: string,
    fields?: readonly IFieldDescriptor[],
  ): IFoundField[] {
    return (fields ? fields : this.fields)
      .filter(this.isMessageType)
      .map((field) => this.mapField(field, typeName))
      .filter((f) => f.fields === undefined || f.fields.length > 0);
  }

  private isMessageType(field: IFieldDescriptor): boolean {
    return field.type === FieldType.MESSAGE;
  }

  private mapField(field: IFieldDescriptor, typeName: string): IFoundField {
    const isFullyQualified = field.typeName.includes('.');

    const fullTypeName = isFullyQualified
      ? field.typeName
      : `${this.packageName}.${field.typeName}`;

    if (fullTypeName === typeName) {
      return { name: field.name };
    }

    const fieldDescriptor = this.messageTypes.get(fullTypeName);
    if (!fieldDescriptor) {
      throw new Error(
        `Could not find field definition for type: ${fullTypeName}`,
      );
    }

    return {
      name: field.name,
      fields: this.findFieldsByType(typeName, fieldDescriptor),
    };
  }
}

import { FieldSelector } from './field.selector';
import { FieldLabel, FieldType, IFieldDescriptor } from './interfaces';

// Helper function to create a full IFieldDescriptor
const createFieldDescriptor = (
  name: string,
  type: FieldType,
  typeName: string = '',
  number: number = 1,
  label: FieldLabel = FieldLabel.OPTIONAL, // adjust as needed for your FieldLabel type
  defaultValue: string | number | boolean = '',
  options: any = {},
  oneofIndex: number = 0,
  extendee: string = '',
  jsonName?: string,
): IFieldDescriptor => ({
  name,
  extendee,
  number,
  label,
  type,
  typeName,
  defaultValue,
  options,
  oneofIndex,
  jsonName: jsonName || name,
});

describe('FieldSelector', () => {
  let messageTypes: Map<string, IFieldDescriptor[]>;

  beforeEach(() => {
    messageTypes = new Map<string, IFieldDescriptor[]>();
  });

  it('should return a direct field match when the field typeName equals the target type', () => {
    const fields = [
      createFieldDescriptor('directField', FieldType.MESSAGE, 'TargetType'),
      createFieldDescriptor('otherField', FieldType.MESSAGE, 'OtherType'),
    ];
    messageTypes.set('OtherType', [
      createFieldDescriptor('id', FieldType.INT32),
    ]);
    messageTypes.set('TargetType', [
      createFieldDescriptor('id', FieldType.INT32),
    ]);

    const selector = new FieldSelector(fields, messageTypes, 'simple');

    const result = selector.findFieldsByType('TargetType');

    expect(result).toEqual([{ name: 'directField' }]);
  });

  it('should return a nested field structure when the target type is found in a nested definition', () => {
    const fields = [
      createFieldDescriptor('outerField', FieldType.MESSAGE, 'OuterType'),
    ];
    // Provide nested field definitions for OuterType.
    const nestedFields = [
      createFieldDescriptor('innerField', FieldType.MESSAGE, 'TargetType'),
      createFieldDescriptor('TargetType', FieldType.INT32),
    ];

    messageTypes.set('OuterType', nestedFields);

    const selector = new FieldSelector(fields, messageTypes);
    const result = selector.findFieldsByType('TargetType');

    expect(result).toEqual([
      { name: 'outerField', fields: [{ name: 'innerField' }] },
    ]);
  });

  it('should filter out fields with empty nested fields', () => {
    const fields = [
      createFieldDescriptor('outerField', FieldType.MESSAGE, 'OuterType'),
    ];
    // Provide nested fields that do not yield any match for the target type.
    const nestedFields = [createFieldDescriptor('OuterType', FieldType.INT32)];
    messageTypes.set('OuterType', nestedFields);

    const selector = new FieldSelector(fields, messageTypes);
    const result = selector.findFieldsByType('TargetType');

    expect(result).toEqual([]);
  });

  it('should throw an error if a nested type definition is missing', () => {
    const fields = [
      createFieldDescriptor('outerField', FieldType.MESSAGE, 'NonExistingType'),
    ];
    const selector = new FieldSelector(fields, messageTypes);

    expect(() => selector.findFieldsByType('TargetType')).toThrowError(
      'Could not find field definition for type: NonExistingType',
    );
  });

  it('should use provided fields parameter over instance fields', () => {
    // Instance fields are defined but will be overridden by the provided parameter.
    const instanceFields = [
      createFieldDescriptor('ignoredField', FieldType.MESSAGE, 'IgnoredType'),
    ];
    const selector = new FieldSelector(instanceFields, messageTypes);
    const providedFields = [
      createFieldDescriptor('directField', FieldType.MESSAGE, 'TargetType'),
    ];

    const result = selector.findFieldsByType('TargetType', providedFields);

    expect(result).toEqual([{ name: 'directField' }]);
  });
});

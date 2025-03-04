import { FieldTransformer } from './field-transformer';
import { ITransformer } from './transformer.interface';
import { FieldType } from '../enums/field-type.enum';
import { StructToJsonTransformer } from './struct-to-json.transformer';

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

    it('should do', () => {
      const requestFields = [
        {
          name: 'data',
          extendee: '',
          number: 1,
          label: 'LABEL_REPEATED',
          type: 'TYPE_MESSAGE',
          typeName: 'Secret',
          defaultValue: '',
          options: null,
          oneofIndex: 0,
          jsonName: '',
          fields: [
            {
              name: 'id',
              extendee: '',
              number: 1,
              label: 'LABEL_OPTIONAL',
              type: 'TYPE_UINT32',
              typeName: '',
              defaultValue: '',
              options: null,
              oneofIndex: 0,
              jsonName: '',
            },
            {
              name: 'key',
              extendee: '',
              number: 2,
              label: 'LABEL_OPTIONAL',
              type: 'TYPE_STRING',
              typeName: '',
              defaultValue: '',
              options: null,
              oneofIndex: 0,
              jsonName: '',
            },
            {
              name: 'value',
              extendee: '',
              number: 3,
              label: 'LABEL_OPTIONAL',
              type: 'TYPE_MESSAGE',
              typeName: 'google.protobuf.Struct',
              defaultValue: '',
              options: null,
              oneofIndex: 0,
              jsonName: '',
            },
            {
              name: 'env',
              extendee: '',
              number: 4,
              label: 'LABEL_OPTIONAL',
              type: 'TYPE_STRING',
              typeName: '',
              defaultValue: '',
              options: null,
              oneofIndex: 0,
              jsonName: '',
            },
            {
              name: 'description',
              extendee: '',
              number: 5,
              label: 'LABEL_OPTIONAL',
              type: 'TYPE_STRING',
              typeName: '',
              defaultValue: '',
              options: null,
              oneofIndex: 0,
              jsonName: '',
            },
          ],
        },
      ];

      const requestData = {
        data: [
          {
            id: 999999,
            key: 'rabbitmq',
            value: {
              fields: {
                port: {
                  numberValue: 5672,
                },
                vhost: {
                  stringValue: '/',
                },
                hostname: {
                  stringValue: 'rabbitmq-dev-int.local',
                },
                password: {
                  stringValue: 'SOME VALUE',
                },
                protocol: {
                  stringValue: 'amqp',
                },
                username: {
                  stringValue: 'client',
                },
                heartbeat: {
                  numberValue: 600,
                },
              },
            },
            env: 'DEV',
          },
        ],
      };

      const { data } = FieldTransformer.traverseAndTransform(
        requestData,
        requestFields,
        [StructToJsonTransformer],
      );

      const transformedData = data[0];

      expect(transformedData?.id).toBe(999999);
      expect(transformedData?.env).toBe('DEV');
      expect(transformedData?.value).toBeDefined();
      expect(transformedData?.value?.hostname).toEqual(
        'rabbitmq-dev-int.local',
      );
      expect(transformedData?.value?.heartbeat).toEqual(600);
      expect(transformedData?.value?.password).toEqual('SOME VALUE');
    });
  });
});

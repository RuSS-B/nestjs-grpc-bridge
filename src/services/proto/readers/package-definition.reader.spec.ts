import { PackageDefinition } from '@grpc/proto-loader';
import { PackageDefinitionReader } from './package-definition.reader';
import { MethodReader } from './method.reader';
import { FieldType } from '../interfaces';
import { loadProto } from '../../../../test/utils/proto';

describe('PackageDefinitionReader', () => {
  let reader: PackageDefinitionReader;
  let packageDefinition: PackageDefinition;

  describe('Simple Proto reading', () => {
    const packageName = 'simple';
    beforeEach(() => {
      packageDefinition = loadProto(['simple/no_imports.proto']);
      reader = new PackageDefinitionReader(packageName, packageDefinition);
    });

    it('should load simple proto with no_imports', () => {
      const keys = Array.from(reader.getMessageTypes().keys());

      expect(keys).toEqual(
        expect.arrayContaining([
          'simple.SimpleRequest',
          'simple.SimpleResponse',
        ]),
      );
    });

    it('should return service reader', () => {
      const serviceReader = reader.getServiceReader('SimpleService');
      expect(serviceReader).toBeDefined();
    });

    it('should return undefined for non-existent service', () => {
      const serviceReader = reader.getServiceReader('NonExistentService');
      expect(serviceReader).toBeUndefined();
    });

    it('should return method reader for existing method', () => {
      const methodReader = reader
        .getServiceReader('SimpleService')
        ?.getMethod('SimpleCall');

      expect(methodReader).toBeDefined();
    });

    it('should return undefined for non-existent method', () => {
      const methodReader = reader
        .getServiceReader('SimpleService')
        ?.getMethod('NonExistentSimpleCall');

      expect(methodReader).toBeUndefined();
    });

    let methodReader: MethodReader | undefined;

    describe('Field extraction', () => {
      beforeEach(() => {
        methodReader = reader
          .getServiceReader('SimpleService')
          ?.getMethod('SimpleCall');
      });

      it('should extract request fields', () => {
        const fields = methodReader?.getRequestFields();
        const fieldNames = fields?.map((f) => f.name);

        expect(fields).toBeDefined();
        expect(fieldNames).toEqual(expect.arrayContaining(['id', 'title']));
      });

      it('should extract response fields', () => {
        const fields = methodReader?.getResponseFields();

        expect(fields).toBeDefined();
        expect(fields?.[0].name).toEqual('id');
        expect(fields?.[0].type).toEqual(FieldType.UINT32);
      });
    });
  });

  describe('Multi-Package reading', () => {
    const packageName = 'package_one';

    beforeAll(() => {
      packageDefinition = loadProto([
        'package_one/simple.proto',
        'package_two/simple.proto',
      ]);
      reader = new PackageDefinitionReader(packageName, packageDefinition);
    });

    it('should load messages from different packages', () => {
      const keys = Array.from(reader.getMessageTypes().keys());

      expect(keys).toEqual(
        expect.arrayContaining([
          'package_one.PackageOneRequest',
          'package_two.PackageTwoResponse',
        ]),
      );
    });
  });

  describe('Nested messages reading', () => {
    const packageName = 'package_one';
    beforeAll(() => {
      packageDefinition = loadProto([
        'package_one/mixed.proto',
        'package_two/simple.proto',
        'package_two/struct_two.proto',
      ]);
      reader = new PackageDefinitionReader(packageName, packageDefinition);
    });

    it('should load messages from different packages', () => {
      const keys = Array.from(reader.getMessageTypes().keys());
      const expectedKeys = [
        'package_one.SimpleNestedRequest',
        'package_one.SimpleNestedResponse',
        'package_one.DeepNestedRequest',
        'package_one.DeepNestedResponse',
        'package_one.SimpleMessageArrayResponse',
        'package_one.NestedMessageArrayResponse',
        'package_one.StructMessage',
        'package_two.PackageTwoResponse',
        'package_two.PackageTwoStructMessage',
        'google.protobuf.Struct',
        'google.protobuf.Value',
        'google.protobuf.ListValue',
        'google.protobuf.Empty',
      ];

      expect(keys).toEqual(expect.arrayContaining(expectedKeys));
      expect(keys.length).toBe(expectedKeys.length);
    });

    it('should get array fields', () => {
      const requestFields = reader
        .getServiceReader('NestedService')
        ?.getMethod('SimpleNested')
        ?.getRequestFields();

      const expectedKeys = [
        'package_one.SimpleNestedRequest',
        'package_one.SimpleNestedResponse',
        'package_one.DeepNestedRequest',
        'package_one.DeepNestedResponse',
        'package_one.SimpleMessageArrayResponse',
        'package_one.NestedMessageArrayResponse',
        'package_one.StructMessage',
        'package_two.PackageTwoResponse',
        'package_two.PackageTwoStructMessage',
        'google.protobuf.Struct',
        'google.protobuf.Value',
        'google.protobuf.ListValue',
        'google.protobuf.Empty',
      ];
    });
  });

  //   it('should get method definition', () => {
  //     const methodDef = reader.getMethodDefinition(
  //       serviceName,
  //       'ProcessNested',
  //     );
  //     expect(methodDef).toBeDefined();
  //     expect(methodDef?.requestType).toBeDefined();
  //   });
  //
  //   it('should return undefined for non-existent method', () => {
  //     const methodDef = reader.getMethodDefinition(serviceName, 'NonExistent');
  //     expect(methodDef).toBeUndefined();
  //   });
  // });
  //

  //   it('should extract response fields', () => {
  //     const fields = reader.getResponseFields(serviceName, 'ProcessNested');
  //     const fieldNames = fields.map((f) => f.name);
  //     expect(fieldNames).toContain('metadata');
  //   });
  //
  //   it('should not count array fields if there are no structs', () => {
  //     const fields = reader.getResponseFields(
  //       serviceName,
  //       'ProcessSimpleArray',
  //     );
  //
  //     const fieldSelector = new FieldSelector(fields, reader.getMessageTypes());
  //
  //     const structFields = fieldSelector.findFieldsByType(
  //       GOOGLE_PROTOBUF_STRUCT,
  //     );
  //
  //     expect(structFields).toHaveLength(0);
  //   });
  //
  //   it('should find fields by type', () => {
  //     const requestFields = reader.getRequestFields(
  //       serviceName,
  //       'ProcessNested',
  //     );
  //
  //     const fieldSelector = new FieldSelector(
  //       requestFields,
  //       reader.getMessageTypes(),
  //     );
  //
  //     const structFields = fieldSelector.findFieldsByType(
  //       GOOGLE_PROTOBUF_STRUCT,
  //     );
  //
  //     expect(structFields).toEqual([
  //       { name: 'metadata' },
  //       { name: 'items' },
  //       { name: 'nested', fields: [{ name: 'settings' }] },
  //       { name: 'external_nested', fields: [{ name: 'config' }] },
  //     ]);
  //   });
  //
  //   it('should return empty array for non-existent fields', () => {
  //     const fields = reader.getRequestFields('NonExistent', 'NonExistent');
  //     expect(fields).toEqual([]);
  //   });
  // });
});

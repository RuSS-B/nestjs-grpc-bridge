import {
  ClientGrpcProxy,
  ClientProviderOptions,
  Transport,
} from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { ClientGrpc } from '@nestjs/microservices';
import { join } from 'path';
import { ProtoPathHelper } from '../../../common/utils';
import { ClientDefinitionReader } from './client-definition.reader';
import { FieldTransformer } from '../../../transformers';
import { StructToJsonTransformer } from '../../../transformers/struct-to-json.transformer';

const packageName = 'package_one';
const protoDir = join(__dirname, '..', '..', '..', '..', 'test', 'protos');

const grpcClientOptions: ClientProviderOptions = {
  name: 'TEST_GRPC_CLIENT',
  transport: Transport.GRPC,
  options: {
    package: packageName,
    protoPath: ProtoPathHelper.readProtoDir(protoDir, 'package_one'),
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      includeDirs: [protoDir],
    },
  },
};

describe('ClientDefinitionReader with real NestJS gRPC clients', () => {
  let client: ClientGrpc;
  let clientDef: ClientDefinitionReader;

  beforeAll(async () => {
    class BaseProxy extends ClientGrpcProxy {
      getService<T extends object>(name: string): T {
        clientDef = new ClientDefinitionReader(this.getClient(name));
        return super.getService(name);
      }
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: 'TEST_GRPC_CLIENT',
          useFactory: () => new BaseProxy(grpcClientOptions['options']),
        },
      ],
    }).compile();

    client = moduleRef.get<ClientGrpc>('TEST_GRPC_CLIENT');
  });

  it('should correctly load a gRPC service', () => {
    const userService = client.getService<any>('NestedService');
    expect(userService).toBeDefined();
    expect(typeof userService).toBe('object');
  });

  it('should correctly output when calling gRPC method', () => {
    const userService = client.getService<any>('NestedService');

    const method = clientDef
      .getService('NestedService')
      .getMethod('simpleNested');

    expect(method).toBeDefined();
    expect(typeof method).toBe('object');
  });

  it('should correctly output request fields', () => {
    const userService = client.getService<any>('NestedService');

    const requestFields = clientDef
      .getService('NestedService')
      .getMethod('simpleNested')
      .getRequestFields();

    expect(requestFields).toBeDefined();
  });

  it('should correctly output request fields', () => {
    const userService = client.getService<any>('NestedService');

    const requestFields = clientDef
      .getService('NestedService')
      .getMethod('simpleNested')
      .getRequestFields();

    const requestData = {
      id: 999999,
      key: 'rabbitmq',
      settings: {
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
    };

    const transformedData = FieldTransformer.traverseAndTransform(
      requestData,
      requestFields,
      [StructToJsonTransformer],
    );

    expect(transformedData?.settings).toBeDefined();
    expect(transformedData?.settings?.hostname).toEqual(
      'rabbitmq-dev-int.local',
    );
    expect(transformedData?.settings?.heartbeat).toEqual(600);
    expect(transformedData?.settings?.password).toEqual('SOME VALUE');
  });
});

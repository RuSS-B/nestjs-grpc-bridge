import { IMessageDescriptor } from '../../../../interfaces';

type ClientDefinitionValue = IServiceDescriptor | IMessageDescriptor;
export type ClientDefinition = Record<string, ClientDefinitionValue>;
export type ServiceMethods = Record<string, IServiceMethodDescriptor>;

export interface IServiceDescriptor {
  service: ServiceMethods;
  serviceName: string;
  length: number;
  name: string;
}

export interface IServiceMethodDescriptor {
  path: string;
  requestStream: boolean;
  responseStream: boolean;
  originalName: string;
  requestType: IMessageDescriptor;
  responseType: IMessageDescriptor;
  options: IServiceMethodDescriptorOptions;
}

interface IServiceMethodDescriptorOptions {
  deprecated: boolean;
  idempotency_level: string;
}

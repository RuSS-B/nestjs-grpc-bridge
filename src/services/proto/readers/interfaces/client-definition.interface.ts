import { IMessageDescriptor } from '../../interfaces';
import { IServiceMethodDescriptor } from './reader.interface';

type ClientDefinitionValue = IServiceDescriptor & IMessageDescriptor;
export type ClientDefinition = Record<string, ClientDefinitionValue>;
export type ServiceMethods = Record<string, IServiceMethodDescriptor>;

export interface IServiceDescriptor {
  service: ServiceMethods;
  serviceName: string;
  length: number;
  name: string;
}

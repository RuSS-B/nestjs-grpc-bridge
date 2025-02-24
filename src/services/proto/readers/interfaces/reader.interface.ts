import { IMessageDescriptor } from '../../interfaces';

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

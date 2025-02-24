import { IMessageDescriptor } from '../../interfaces';
import { MethodDefinition } from '@grpc/proto-loader';

interface IServiceDescriptor {
  [index: string]: MethodDefinition<object, object>;
}

export interface IPackageDefinition {
  [key: string]: IServiceDescriptor & IMessageDescriptor;
}

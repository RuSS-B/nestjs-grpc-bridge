import { MethodDefinition } from '@grpc/proto-loader';
import { IMessageDescriptor } from '../../../../interfaces';

interface IServiceDescriptor {
  [index: string]: MethodDefinition<object, object>;
}

export interface IPackageDefinition {
  [key: string]: IServiceDescriptor & IMessageDescriptor;
}

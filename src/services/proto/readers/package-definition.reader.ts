import { PackageDefinition } from '@grpc/proto-loader';
import { IPackageDefinition } from './interfaces';
import { ServiceReader } from './service.reader';
import {
  IFieldDescriptor,
  IMessageDescriptor,
  MessageDefinitionMap,
} from '../../../interfaces';

export class PackageDefinitionReader {
  private readonly messageTypes: MessageDefinitionMap;

  constructor(
    private readonly packageName: string,
    private readonly def: PackageDefinition,
  ) {
    this.messageTypes = this.loadMessageTypes();
  }

  getPackageName() {
    return this.packageName;
  }

  getServiceReader(name: string): ServiceReader<any> | undefined {
    let service = this.def[name];

    if (!service) {
      service = this.def[`${this.packageName}.${name}`];
    }

    if (!service) {
      return undefined;
    }

    return new ServiceReader(service, this.packageName);
  }

  getMessageDescriptor(messageName: string): IMessageDescriptor {
    const message = this.def[messageName];

    if (!message) {
      return this.def[
        `${this.getPackageName()}.${messageName}`
      ] as IMessageDescriptor;
    } else {
      return message as IMessageDescriptor;
    }
  }

  private loadMessageTypes(): Map<string, IFieldDescriptor[]> {
    const map = new Map<string, IFieldDescriptor[]>();

    for (const [key, value] of Object.entries(this.def as IPackageDefinition)) {
      if (typeof value === 'object' && value?.type?.field) {
        map.set(key, value.type.field);
      }
    }

    return map;
  }

  getMessageTypes(): MessageDefinitionMap {
    return this.messageTypes;
  }
}

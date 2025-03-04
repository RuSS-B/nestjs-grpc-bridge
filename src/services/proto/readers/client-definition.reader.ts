import {
  ClientDefinition,
  IServiceMethodDescriptor,
  ServiceMethods,
} from './interfaces';
import {
  IFieldDescriptor,
  IMessageDescriptor,
  MessageDefinitionMap,
  NestedFieldDescriptor,
} from '../../../interfaces';

export class ClientDefinitionReader {
  readonly messageDefinitionMap: MessageDefinitionMap;
  readonly serviceMap = new Map<string, ClientServiceDefinition>();

  constructor(private readonly def: ClientDefinition) {
    const { messageMap, serviceMap } = this.loadDefinitions();
    this.messageDefinitionMap = messageMap;
    this.serviceMap = serviceMap;
  }

  /**
   * Load definitions into maps
   */
  private loadDefinitions() {
    const messageMap = new Map<string, IFieldDescriptor[]>();
    const serviceMap = new Map<string, ClientServiceDefinition>();

    for (const [key, value] of Object.entries(this.def)) {
      if (typeof value === 'function') {
        serviceMap.set(key, new ClientServiceDefinition(value, messageMap));
      } else if (this.isMessageDescriptor(value)) {
        messageMap.set(key, value.type.field);
      }
    }

    return { messageMap, serviceMap };
  }

  private isMessageDescriptor(value: any): value is IMessageDescriptor {
    return (
      value &&
      typeof value === 'object' &&
      'type' in value &&
      'field' in value.type
    );
  }

  getService(name: string): ClientServiceDefinition {
    const service = this.serviceMap.get(name);

    if (!service) {
      throw new Error(`Service ${name} not found`);
    }

    return service;
  }
}

class ClientMethodDefinition {
  constructor(
    private readonly def: IServiceMethodDescriptor,
    public readonly name: string,
    private readonly messageDefinitionMap: MessageDefinitionMap,
  ) {}

  getRequestFields(): ReadonlyArray<NestedFieldDescriptor> {
    return this.extractFields(this.def.requestType.type.field);
  }

  getResponseFields(): ReadonlyArray<NestedFieldDescriptor> {
    return this.extractFields(this.def.responseType.type.field);
  }

  private extractFields(
    fields: ReadonlyArray<IFieldDescriptor>,
  ): ReadonlyArray<NestedFieldDescriptor> {
    return fields.map((field) => {
      const nestedFields = this.messageDefinitionMap.get(field.typeName);
      return nestedFields
        ? { ...field, fields: this.extractFields(nestedFields) }
        : field;
    });
  }
}

class ClientServiceDefinition {
  private readonly methodMap = new Map<string, ClientMethodDefinition>();

  constructor(
    private readonly def: ServiceMethods,
    private readonly messageDefinitionMap: MessageDefinitionMap,
  ) {
    this.loadMethodDefinitions();
  }

  private loadMethodDefinitions() {
    const services = this.def.service;
    for (const [key, value] of Object.entries(services)) {
      this.methodMap.set(
        value.originalName,
        new ClientMethodDefinition(value, key, this.messageDefinitionMap),
      );
    }
  }

  getMethod(name: string): ClientMethodDefinition {
    const method = this.methodMap.get(name);

    if (!method) {
      throw new Error(`Method ${name} not found`);
    }

    return method;
  }
}

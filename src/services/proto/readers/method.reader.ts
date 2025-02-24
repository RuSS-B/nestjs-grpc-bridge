import { IFieldDescriptor } from '../interfaces';
import { IServiceMethodDescriptor } from './interfaces';

export class MethodReader {
  constructor(private readonly def: IServiceMethodDescriptor) {}

  getRequestFields(): IFieldDescriptor[] {
    return this.def.requestType.type.field;
  }

  getResponseFields(): IFieldDescriptor[] {
    return this.def.responseType.type.field;
  }
}

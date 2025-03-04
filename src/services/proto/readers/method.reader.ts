import { IServiceMethodDescriptor } from './interfaces';
import { IFieldDescriptor } from '../../../interfaces';

export class MethodReader {
  constructor(private readonly def: IServiceMethodDescriptor) {}

  getRequestFields(): IFieldDescriptor[] {
    return this.def.requestType.type.field;
  }

  getResponseFields(): IFieldDescriptor[] {
    return this.def.responseType.type.field;
  }
}

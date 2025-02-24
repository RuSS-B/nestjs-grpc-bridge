import { MethodReader } from './method.reader';
import { IServiceDefinition } from '../interfaces';

export class ServiceReader<T extends IServiceDefinition> {
  constructor(
    private readonly def: T,
    private readonly packageName?: string,
  ) {}

  getMethod(name: string): MethodReader | undefined {
    let method = this.def[name];

    if (!method && this.packageName) {
      method = this.def[`${this.packageName}.${name}`];
    }

    if (!method) {
      return undefined;
    }

    return new MethodReader(method);
  }
}

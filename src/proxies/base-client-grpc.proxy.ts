import { ClientGrpcProxy, RpcException } from '@nestjs/microservices';
import { FieldTransformer } from '../transformers';
import { map } from 'rxjs';
import { ClientDefinitionReader } from '../services/proto/readers/client-definition.reader';
import { StructToJsonTransformer } from '../transformers/struct-to-json.transformer';

export class BaseClientGrpcProxy extends ClientGrpcProxy {
  getService<T extends Record<string | symbol, any>>(name: string): T {
    const service = super.getService(name);
    const clientDefinitionReader = new ClientDefinitionReader(
      this.getClient(name),
    );

    return new Proxy(service, {
      get(target: Record<string | symbol, any>, p: string | symbol): any {
        if (typeof target[p] !== 'function') {
          return target[p];
        }

        const responseFields = clientDefinitionReader
          .getService(name)
          .getMethod(p.toString())
          .getResponseFields();

        return (...args: any[]) => {
          return target[p](...args).pipe(
            map((response: any) => {
              return FieldTransformer.traverseAndTransform(
                response,
                responseFields,
                [StructToJsonTransformer],
              );
            }),
          );
        };
      },
    }) as T;
  }

  protected serializeError(err: any): any {
    return new RpcException(err);
  }
}

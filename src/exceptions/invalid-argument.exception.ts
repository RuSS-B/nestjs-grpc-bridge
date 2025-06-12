import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class InvalidArgumentException extends RpcException {
  constructor(message: string) {
    super({
      code: status.INVALID_ARGUMENT,
      message,
    });
  }
}

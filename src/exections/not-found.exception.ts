import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class NotFoundException extends RpcException {
  constructor(message: string) {
    super({
      code: status.NOT_FOUND,
      message,
    });
  }
}

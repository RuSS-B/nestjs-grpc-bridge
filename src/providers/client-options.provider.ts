import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ProtoPathHelper } from '../common/utils';

interface IOptions {
  protoDir: string;
  packageName: string;
  url: string;
  loader?: GrpcOptions['options']['loader'];
}

export class ClientOptionsProvider {
  getOptions(options: IOptions): GrpcOptions {
    const packageName = options.packageName;

    return {
      transport: Transport.GRPC,
      options: {
        loader: options.loader,
        gracefulShutdown: true,
        url: options.url,
        package: packageName,
        protoPath: ProtoPathHelper.readProtoDir(packageName, options.protoDir),
      },
    };
  }
}

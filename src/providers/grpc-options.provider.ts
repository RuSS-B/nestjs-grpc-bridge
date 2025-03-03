import { Injectable } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import { PackageDefinition } from '@grpc/proto-loader';
import { PackageDefinitionService } from '../services/package-definition';
import { ProtoPathHelper } from '../common/utils/proto-path.helper';

interface IOptions {
  usePackageDefinitionService?: boolean;
  useReflectionService?: boolean;
  protoDir: string;
  packageName: string;
  url: string;
  loader?: GrpcOptions['options']['loader'];
}

@Injectable()
export class GrpcOptionsProvider {
  constructor(
    private readonly grpcPackageDefinitionService: PackageDefinitionService,
  ) {}

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
        onLoadPackageDefinition: (pkg: PackageDefinition, server) => {
          if (options.usePackageDefinitionService) {
            this.grpcPackageDefinitionService.setPackageDefinition(
              packageName,
              pkg,
            );
          }

          if (options.useReflectionService) {
            new ReflectionService(pkg).addToServer(server);
          }
        },
      },
    };
  }
}

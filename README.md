You're right to question this. The `customClass` option isn't part of the standard NestJS API. Let me provide a corrected README with the proper way to register the custom gRPC client:

# nestjs-grpc-bridge

A NestJS library for enhanced gRPC communication with automatic response transformation.

## Features

- Automatic transformation of gRPC responses
- Support for Google Protocol Buffers Struct to JSON conversion
- Custom field transformers
- Type-safe gRPC client proxies
- Proto definition introspection

## Installation

```bash
npm install nestjs-grpc-bridge
```

## Usage

### Example Setup

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BaseClientGrpcProxy } from 'nestjs-grpc-bridge';

@Module({
    providers: [
        {
            inject: [ConfigService],
            provide: 'NAME_OF_YOUR_SERVICE',
            useFactory(configService: ConfigService) {
                const packageName = 'YOUR_PACKAGE_NAME';
                const protoDir = resolve(__dirname, 'PATH', 'TO', 'YOUR', 'PROTO', 'DIR');
                const protoPath = ProtoPathHelper.readProtoDir(protoDir, packageName);

                return new BaseClientGrpcProxy({
                    url: configService.getOrThrow<string>('VAULT_URL'),
                    package: packageName,
                    protoPath,
                    loader: {
                        longs: Number,
                        objects: true,
                        arrays: true,
                        includeDirs: [protoDir],
                    },
                });
            },
        },
    ],
})
export class AppModule {}
```

### Using the Service

```typescript
import {Injectable} from '@nestjs/common';
import {Client, ClientGrpc} from '@nestjs/microservices';
import {Observable} from 'rxjs';

interface GrpcService {
    getData(request: any): Observable<any>;
}

@Injectable()
export class AppService {
    private readonly myGrpcServiceClient: MyGrpcServiceClient;

    constructor(
        @Inject('NAME_OF_YOUR_SERVICE') private readonly client: ClientGrpc,
    ) {
        this.myGrpcServiceClient =
            this.client.getService<MyGrpcServiceClient>('MyGrpcService');
    }

    get myGrpcService(): MyGrpcServiceClient {
        return this.myGrpcServiceClient;
    }
    
    async loadData() {
        const { data } = await firstValueFrom(
            this.myGrpcService.findAll({ env: 'DEV' }),
        );
        
        return data;
    }
}
```

Converts Google Protocol Buffers Struct objects to plain JSON objects.


What server sends
```json5
{
  id: 999999,
  key: 'rabbitmq',
  value: {
    fields: {
      port: {
        numberValue: 5672,
      },
      vhost: {
        stringValue: '/',
      }
    }
  }
}
```

What you get in response
```json5
{
  id: 999999,
  key: 'rabbitmq',
  value: {
    port: 5672,
    vhost:'/',
  }
}
```

The library also supports nested structs.

## License

MIT

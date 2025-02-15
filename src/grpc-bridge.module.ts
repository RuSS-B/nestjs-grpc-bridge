import { Module } from '@nestjs/common';
import { GrpcOptionsProvider } from './providers';

@Module({
  providers: [GrpcOptionsProvider],
  exports: [GrpcOptionsProvider],
})
export class GrpcBridgeModule {}

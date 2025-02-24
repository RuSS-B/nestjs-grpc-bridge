import { Injectable, Scope } from '@nestjs/common';
import { PackageDefinition } from '@grpc/proto-loader';
import { PackageDefinitionReader } from '../proto/readers/package-definition.reader';

/**
 * Service for reading and accessing gRPC package definitions.
 * Provides methods to work with services, methods, and their field definitions.
 */
@Injectable({ scope: Scope.DEFAULT })
export class PackageDefinitionService {
  private packageDefinitionReader: PackageDefinitionReader;

  setPackageDefinition(packageName: string, pkg: PackageDefinition) {
    this.packageDefinitionReader = new PackageDefinitionReader(
      packageName,
      pkg,
    );
  }

  getReader(): PackageDefinitionReader {
    if (!this.packageDefinitionReader) {
      throw new Error('PackageDefinitionReader not initialized');
    }

    return this.packageDefinitionReader;
  }
}

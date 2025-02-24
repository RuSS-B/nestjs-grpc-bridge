import { loadSync, PackageDefinition } from '@grpc/proto-loader';
import { join } from 'path';

export const loadProto = (protoPaths: string[]): PackageDefinition => {
  const protoDir = join(__dirname, '../../test/protos/');

  return loadSync(
    protoPaths.map((p) => join(protoDir, p)),
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [protoDir],
    },
  );
};

import { join } from 'node:path';
import { readdirSync } from 'node:fs';

export class ProtoPathHelper {
  static readProtoDir(protoDir: string, packageName: string): string[] {
    const fullPath = join(protoDir, packageName);

    return readdirSync(fullPath)
      .filter((f) => f.endsWith('proto'))
      .map((f) => join(fullPath, f));
  }
}

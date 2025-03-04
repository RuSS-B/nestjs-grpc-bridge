import { IFieldDescriptor } from './proto-descriptors.interface';

export interface NestedFieldDescriptor extends IFieldDescriptor {
  fields?: ReadonlyArray<NestedFieldDescriptor>;
}

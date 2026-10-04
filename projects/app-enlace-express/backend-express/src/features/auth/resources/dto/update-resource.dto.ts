import { ResourceMethod } from "./create-resource.dto";

export interface UpdateResourceDto {
  method: ResourceMethod;
  path: string;
  description?: string | null;
}

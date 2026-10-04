export type ResourceMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface CreateResourceDto {
  method: ResourceMethod;
  path: string;
  description?: string | null;
  status?: "active" | "inactive";
}

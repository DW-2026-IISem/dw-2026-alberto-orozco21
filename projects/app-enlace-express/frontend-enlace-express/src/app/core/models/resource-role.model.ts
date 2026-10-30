import { Status, Timestamps } from './api.model';

export interface ResourceRole extends Timestamps {
  id: number;
  role_id: number;
  resource_id: number;
  status: Status;
}

export type ResourceRolePayload = Pick<ResourceRole, 'role_id' | 'resource_id'>;
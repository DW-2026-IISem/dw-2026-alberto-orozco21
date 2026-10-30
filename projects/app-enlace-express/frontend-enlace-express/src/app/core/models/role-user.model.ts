import { Status, Timestamps } from './api.model';

export interface RoleUser extends Timestamps {
  id: number;
  user_id: number;
  role_id: number;
  status: Status;
}

export type RoleUserPayload = Pick<RoleUser, 'user_id' | 'role_id'>;
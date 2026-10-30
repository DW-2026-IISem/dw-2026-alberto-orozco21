import { Timestamps } from './api.model';
import { HttpMethod } from './resource.model';
import { Status } from './api.model';

export interface SessionTokens {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

export interface EffectivePermission {
  resource_id: number;
  method: HttpMethod;
  path: string;
  description: string | null;
  role_id: number;
  role_name: string;
}

export interface UserSession extends Timestamps {
  id: number;
  user_id: number;
  family_id: string;
  device_info: string | null;
  expires_at: string;
  status: Status;
  is_expired: boolean;
}
import { Status, Timestamps } from './api.model';

export interface User extends Timestamps {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  status: Status;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  status?: Status;
}

export interface UpdateUserPayload {
  username: string;
  email: string;
  avatar?: string | null;
}

export type PatchUserPayload = Partial<UpdateUserPayload>;

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
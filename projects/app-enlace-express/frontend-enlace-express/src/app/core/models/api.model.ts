export type Status = 'active' | 'inactive';
export type Money = number | string;

export interface ApiError {
  error: string;
  detail?: string;
}

export interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface ActiveRecord extends Timestamps {
  id: number;
  is_active: boolean;
}

export function toNumber(value: Money | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
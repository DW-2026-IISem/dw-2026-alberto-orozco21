import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccessPayload, EffectivePermission, SessionTokens } from '../models/auth.model';
import { HttpMethod, Resource } from '../models/resource.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

const STORAGE_KEY = 'enlace-express.session.v1';

interface PersistedSession {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  permissions: EffectivePermission[];
}

@Injectable({ providedIn: 'root' })
export class SessionStore {
  readonly authEnabled = environment.requireAuth;

  private readonly _accessToken = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);
  private readonly _permissions = signal<EffectivePermission[]>([]);

  readonly accessToken = this._accessToken.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();
  readonly user = this._user.asReadonly();
  readonly permissions = this._permissions.asReadonly();
  readonly isAuthenticated = computed(() => this._accessToken() !== null);
  readonly roleNames = computed(() =>
    [...new Set(this._permissions().map((permission) => permission.role_name))].sort(),
  );
  readonly roles = computed<Role[]>(() => {
    const roles = new Map<number, Role>();
    for (const permission of this._permissions()) {
      if (!roles.has(permission.role_id)) {
        roles.set(permission.role_id, {
          id: permission.role_id,
          name: permission.role_name,
          description: null,
          status: 'active',
        });
      }
    }
    return [...roles.values()];
  });
  readonly resources = computed<Resource[]>(() =>
    this._permissions().map((permission) => ({
      id: permission.resource_id,
      method: permission.method,
      path: permission.path,
      description: permission.description,
      status: 'active',
    })),
  );
  readonly permissionsIndex = computed(
    () => new Set(this._permissions().map((permission) => `${permission.method} ${permission.path}`)),
  );
  readonly permissionCount = computed(() => this._permissions().length);

  constructor() {
    this.restore();
  }

  setTokens(tokens: SessionTokens): void {
    this._accessToken.set(tokens.access_token);
    this._refreshToken.set(tokens.refresh_token);
    this.persist();
  }

  setAccess(access: AccessPayload): void {
    this._user.set(access.user);
    this._permissions.set(access.permissions ?? []);
    this.persist();
  }

  clear(): void {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._user.set(null);
    this._permissions.set([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable in private browsing contexts.
    }
  }

  can(method: HttpMethod | string, path: string): boolean {
    if (!this.authEnabled) {
      return true;
    }
    const verb = method.toUpperCase();
    const requestPath = path.split('?')[0];
    return this._permissions().some(
      (permission) =>
        permission.method === verb && pathMatches(permission.path, requestPath),
    );
  }

  canPermission(permission: string): boolean {
    if (!this.authEnabled) {
      return true;
    }
    const separator = permission.indexOf(' ');
    return (
      separator >= 0 &&
      this.can(permission.slice(0, separator), permission.slice(separator + 1))
    );
  }

  hasRole(name: string): boolean {
    return this.roleNames().includes(name.toUpperCase());
  }

  private restore(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const data = JSON.parse(raw) as PersistedSession;
      if (!Array.isArray(data.permissions)) {
        this.clear();
        return;
      }
      this._accessToken.set(data.accessToken ?? null);
      this._refreshToken.set(data.refreshToken ?? null);
      this._user.set(data.user ?? null);
      this._permissions.set(data.permissions);
    } catch {
      this.clear();
    }
  }

  private persist(): void {
    const data: PersistedSession = {
      accessToken: this._accessToken(),
      refreshToken: this._refreshToken(),
      user: this._user(),
      permissions: this._permissions(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Keep the session in memory if storage is unavailable or full.
    }
  }
}

function pathMatches(pattern: string, path: string): boolean {
  const escaped = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\/:([^/]+)/g, '/[^/]+');
  return new RegExp(`^${escaped}$`).test(path);
}
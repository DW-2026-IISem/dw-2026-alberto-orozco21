import { AccessPayload, SessionTokens } from '../models/auth.model';
import { SessionStore } from './session-store';

const tokens: SessionTokens = {
  access_token: 'access-token',
  token_type: 'Bearer',
  expires_in: 900,
  refresh_token: 'refresh-token',
  refresh_expires_in: 86400,
};

const access: AccessPayload = {
  user: {
    id: 7,
    username: 'alberto',
    email: 'alberto@example.test',
    avatar: null,
    status: 'active',
  },
  permissions: [
    {
      resource_id: 12,
      method: 'GET',
      path: '/api/usuarios/:id',
      description: 'Consultar usuario',
      role_id: 3,
      role_name: 'OPERADOR',
    },
  ],
};

describe('SessionStore', () => {
  beforeEach(() => localStorage.removeItem('enlace-express.session.v1'));

  it('restores tokens, user, and effective permissions from storage', () => {
    const session = new SessionStore();
    session.setTokens(tokens);
    session.setAccess(access);

    const restored = new SessionStore();

    expect(restored.isAuthenticated()).toBe(true);
    expect(restored.user()).toEqual(access.user);
    expect(restored.permissions()).toEqual(access.permissions);
    expect(restored.roleNames()).toEqual(['OPERADOR']);
    expect(restored.permissionCount()).toBe(1);
  });

  it('matches parameterized paths and ignores query strings', () => {
    const session = new SessionStore();
    session.setAccess(access);

    expect(session.can('get', '/api/usuarios/7?include=roles')).toBe(true);
    expect(session.canPermission('GET /api/usuarios/42')).toBe(true);
    expect(session.can('DELETE', '/api/usuarios/7')).toBe(false);
  });

  it('clears all session state and persisted data', () => {
    const session = new SessionStore();
    session.setTokens(tokens);
    session.setAccess(access);

    session.clear();

    expect(session.isAuthenticated()).toBe(false);
    expect(session.user()).toBeNull();
    expect(session.permissions()).toEqual([]);
    expect(localStorage.getItem('enlace-express.session.v1')).toBeNull();
  });
});
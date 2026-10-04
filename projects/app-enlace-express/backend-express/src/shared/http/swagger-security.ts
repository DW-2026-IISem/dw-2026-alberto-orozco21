export const bearerSecurityScheme = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description:
      "Access token JWT obtained from POST /api/sesion/login. Send it using " +
      "the Authorization: Bearer <token> header.",
  },
};

export const openSecurity: unknown[] = [];

export const bearerSecurity = [{ bearerAuth: [] }];

export const unauthorizedResponse = {
  description: "401 Unauthorized: missing, invalid, expired, or inactive-user credentials",
};

export const forbiddenResponse = {
  description: "403 Forbidden: authenticated user has no active grant for this operation",
};

export const invalidIdResponse = {
  description: "400 Invalid id: must be a positive integer",
};

export const notFoundResponse = {
  description: "404 Resource not found",
};

import { NextFunction, Request, Response } from "express";
import { isOperationGranted, normalizePath } from "../../../shared/auth/resource-match";
import { requireAuthUser } from "../../../shared/auth/auth-user";
import { AppError } from "../../../shared/errors/app-error";
import { sendError } from "../../../shared/http/error-response";
import { ResourceRolesService } from "../resource-roles/resource-roles.service";

const resourceRolesService = new ResourceRolesService();

export async function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authUser = requireAuthUser(req);
    const method = req.method.toUpperCase();
    const path = normalizePath(req.originalUrl);
    const permissions = await resourceRolesService.findEffectiveForUser(authUser.id);

    if (!isOperationGranted(permissions, method, path)) {
      throw new AppError(403, `Forbidden: no grant for ${method} ${path}`);
    }

    next();
  } catch (error) {
    sendError(res, error);
  }
}

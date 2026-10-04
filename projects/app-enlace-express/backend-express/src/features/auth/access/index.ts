import { NextFunction, Request, Response } from "express";
import { isOperationGranted } from "../../../shared/auth/resource-match";
import { requireAuthUser } from "../../../shared/auth/auth-user";
import { extractBearerToken, verifyAccessToken } from "../../../shared/auth/jwt";
import { AppError } from "../../../shared/errors/app-error";
import { sendError } from "../../../shared/http/error-response";
import { ResourceRolesService } from "../resource-roles/resource-roles.service";
import { UsersRepository } from "../users/users.repository";

const usersRepository = new UsersRepository();
const resourceRolesService = new ResourceRolesService();

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractBearerToken(req.header("authorization"));
    if (!token) throw new AppError(401, "Authentication required");

    const payload = verifyAccessToken(token);
    const user = await usersRepository.findById(Number(payload.sub));
    if (!user || user.status !== "active" || user.username !== payload.username) {
      throw new AppError(401, "Invalid or inactive user credentials");
    }

    req.auth = {
      id: user.id,
      username: user.username,
      email: user.email,
      tokenId: payload.jti,
    };
    next();
  } catch (error) {
    sendError(res, error);
  }
}

export async function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authUser = requireAuthUser(req);
    const permissions = await resourceRolesService.findEffectiveForUser(authUser.id);
    if (!isOperationGranted(permissions, req.method, req.path)) {
      throw new AppError(403, "You are not authorized to perform this operation");
    }
    next();
  } catch (error) {
    sendError(res, error);
  }
}

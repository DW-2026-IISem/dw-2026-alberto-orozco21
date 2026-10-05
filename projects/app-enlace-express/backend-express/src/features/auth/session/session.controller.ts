import { Request, Response } from "express";
import { requireAuthUser } from "../../../shared/auth/auth-user";
import { BaseController } from "../../../shared/http/base-controller";
import { SessionService } from "./session.service";
import { LoginDto, LogoutSessionDto, RefreshSessionDto } from "./dto";

export class SessionController extends BaseController {
  public constructor(private readonly service: SessionService = new SessionService()) {
    super();
  }

  public async login(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const tokens = await this.service.login(req.body as LoginDto, deviceInfo(req));
      res.status(200).json(tokens);
    });
  }

  public async refresh(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const tokens = await this.service.refresh(req.body as RefreshSessionDto, deviceInfo(req));
      res.status(200).json(tokens);
    });
  }

  public async logout(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.logout(req.body as LogoutSessionDto);
      res.status(200).json({ message: "Session closed" });
    });
  }

  public async profile(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const user = await this.service.profile(requireAuthUser(req).id);
      res.status(200).json({ user });
    });
  }

  public async myPermissions(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const permissions = await this.service.myPermissions(requireAuthUser(req).id);
      res.status(200).json({ permissions });
    });
  }
}

function deviceInfo(req: Request): string | null {
  const userAgent = req.headers["user-agent"];
  return userAgent ? String(userAgent).slice(0, 500) : null;
}

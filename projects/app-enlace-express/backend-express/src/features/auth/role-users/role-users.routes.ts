import { Application } from "express";
import { authenticate, authorize } from "../access";
import { RoleUsersController } from "./role-users.controller";

export class RoleUsersRoutes {
  public roleUsersController = new RoleUsersController();

  public routes(app: Application): void {
    app
      .route("/api/asignaciones-rol")
      .get(authenticate, authorize, this.roleUsersController.getAll.bind(this.roleUsersController))
      .post(authenticate, authorize, this.roleUsersController.assign.bind(this.roleUsersController));

    app
      .route("/api/asignaciones-rol/:id")
      .get(authenticate, authorize, this.roleUsersController.getOne.bind(this.roleUsersController));

    app
      .route("/api/asignaciones-rol/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.roleUsersController.deactivate.bind(this.roleUsersController)
      );

    app
      .route("/api/asignaciones-rol/:id/reactivate")
      .patch(
        authenticate,
        authorize,
        this.roleUsersController.reactivate.bind(this.roleUsersController)
      );
  }
}

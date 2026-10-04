import { Application } from "express";
import { authenticate, authorize } from "../access";
import { UsersController } from "./users.controller";

export class UsersRoutes {
  public usersController = new UsersController();

  public routes(app: Application): void {
    app
      .route("/api/usuarios")
      .get(authenticate, authorize, this.usersController.getAll.bind(this.usersController))
      .post(authenticate, authorize, this.usersController.create.bind(this.usersController));

    app
      .route("/api/usuarios/:id")
      .get(authenticate, authorize, this.usersController.getOne.bind(this.usersController))
      .put(authenticate, authorize, this.usersController.updatePut.bind(this.usersController))
      .patch(authenticate, authorize, this.usersController.updatePatch.bind(this.usersController))
      .delete(authenticate, authorize, this.usersController.deletePhysical.bind(this.usersController));

    app
      .route("/api/usuarios/:id/deactivate")
      .patch(authenticate, authorize, this.usersController.deleteLogical.bind(this.usersController));

    app
      .route("/api/usuarios/:id/password")
      .patch(authenticate, authorize, this.usersController.changePassword.bind(this.usersController));

    app
      .route("/api/usuarios/:id/permisos")
      .get(
        authenticate,
        authorize,
        this.usersController.getEffectivePermissions.bind(this.usersController)
      );
  }
}

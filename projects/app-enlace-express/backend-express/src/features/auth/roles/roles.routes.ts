import { Application } from "express";
import { authenticate, authorize } from "../access";
import { RolesController } from "./roles.controller";

export class RolesRoutes {
  public rolesController = new RolesController();

  public routes(app: Application): void {
    app
      .route("/api/roles")
      .get(authenticate, authorize, this.rolesController.getAll.bind(this.rolesController))
      .post(authenticate, authorize, this.rolesController.create.bind(this.rolesController));

    app
      .route("/api/roles/:id")
      .get(authenticate, authorize, this.rolesController.getOne.bind(this.rolesController))
      .put(authenticate, authorize, this.rolesController.updatePut.bind(this.rolesController))
      .patch(authenticate, authorize, this.rolesController.updatePatch.bind(this.rolesController))
      .delete(authenticate, authorize, this.rolesController.deletePhysical.bind(this.rolesController));

    app
      .route("/api/roles/:id/deactivate")
      .patch(authenticate, authorize, this.rolesController.deleteLogical.bind(this.rolesController));
  }
}

import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { PackageController } from "./package.controller";

export class PackageRoutes {
  public packageController: PackageController = new PackageController();

  public routes(app: Application): void {
    app
      .route("/api/packages")
      .get(authenticate, authorize, this.packageController.getAll.bind(this.packageController))
      .post(authenticate, authorize, this.packageController.create.bind(this.packageController));

    app
      .route("/api/packages/:id")
      .get(authenticate, authorize, this.packageController.getOne.bind(this.packageController))
      .put(authenticate, authorize, this.packageController.updatePut.bind(this.packageController))
      .patch(authenticate, authorize, this.packageController.updatePatch.bind(this.packageController))
      .delete(authenticate, authorize, this.packageController.deletePhysical.bind(this.packageController));

    app
      .route("/api/packages/:id/deactivate")
      .patch(authenticate, authorize, this.packageController.deleteLogical.bind(this.packageController));
  }
}

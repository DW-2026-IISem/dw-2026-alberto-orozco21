import { Application } from "express";
import { PackageController } from "./package.controller";

export class PackageRoutes {
  public packageController: PackageController = new PackageController();

  public routes(app: Application): void {
    app
      .route("/api/packages")
      .get(this.packageController.getAll.bind(this.packageController))
      .post(this.packageController.create.bind(this.packageController));

    app
      .route("/api/packages/:id")
      .get(this.packageController.getOne.bind(this.packageController))
      .put(this.packageController.updatePut.bind(this.packageController))
      .patch(this.packageController.updatePatch.bind(this.packageController))
      .delete(this.packageController.deletePhysical.bind(this.packageController));

    app
      .route("/api/packages/:id/deactivate")
      .patch(this.packageController.deleteLogical.bind(this.packageController));
  }
}

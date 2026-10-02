import { Application } from "express";
import { RateController } from "./rate.controller";

export class RateRoutes {
  public rateController: RateController = new RateController();

  public routes(app: Application): void {
    app
      .route("/api/rates")
      .get(this.rateController.getAll.bind(this.rateController))
      .post(this.rateController.create.bind(this.rateController));

    app
      .route("/api/rates/:id")
      .get(this.rateController.getOne.bind(this.rateController))
      .put(this.rateController.updatePut.bind(this.rateController))
      .patch(this.rateController.updatePatch.bind(this.rateController))
      .delete(this.rateController.deletePhysical.bind(this.rateController));

    app
      .route("/api/rates/:id/deactivate")
      .patch(this.rateController.deleteLogical.bind(this.rateController));
  }
}

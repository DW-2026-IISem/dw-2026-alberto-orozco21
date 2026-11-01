import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { RateController } from "./rate.controller";

export class RateRoutes {
  public rateController: RateController = new RateController();

  public routes(app: Application): void {
    app
      .route("/api/rates")
      .get(authenticate, authorize, this.rateController.getAll.bind(this.rateController))
      .post(authenticate, authorize, this.rateController.create.bind(this.rateController));

    app
      .route("/api/rates/:id")
      .get(authenticate, authorize, this.rateController.getOne.bind(this.rateController))
      .put(authenticate, authorize, this.rateController.updatePut.bind(this.rateController))
      .patch(authenticate, authorize, this.rateController.updatePatch.bind(this.rateController))
      .delete(authenticate, authorize, this.rateController.deletePhysical.bind(this.rateController));

    app
      .route("/api/rates/:id/deactivate")
      .patch(authenticate, authorize, this.rateController.deleteLogical.bind(this.rateController));
  }
}

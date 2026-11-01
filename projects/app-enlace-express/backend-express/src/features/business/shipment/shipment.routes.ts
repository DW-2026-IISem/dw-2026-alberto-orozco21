import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ShipmentController } from "./shipment.controller";

export class ShipmentRoutes {
  public shipmentController: ShipmentController = new ShipmentController();

  public routes(app: Application): void {
    app
      .route("/api/shipments")
      .get(authenticate, authorize, this.shipmentController.getAll.bind(this.shipmentController))
      .post(authenticate, authorize, this.shipmentController.create.bind(this.shipmentController));

    app
      .route("/api/shipments/:id")
      .get(authenticate, authorize, this.shipmentController.getOne.bind(this.shipmentController))
      .put(authenticate, authorize, this.shipmentController.updatePut.bind(this.shipmentController))
      .patch(authenticate, authorize, this.shipmentController.updatePatch.bind(this.shipmentController))
      .delete(authenticate, authorize, this.shipmentController.deletePhysical.bind(this.shipmentController));

    app
      .route("/api/shipments/:id/deactivate")
      .patch(authenticate, authorize, this.shipmentController.deleteLogical.bind(this.shipmentController));
  }
}

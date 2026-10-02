import { Application } from "express";
import { ShipmentController } from "./shipment.controller";

export class ShipmentRoutes {
  public shipmentController: ShipmentController = new ShipmentController();

  public routes(app: Application): void {
    app
      .route("/api/shipments")
      .get(this.shipmentController.getAll.bind(this.shipmentController))
      .post(this.shipmentController.create.bind(this.shipmentController));

    app
      .route("/api/shipments/:id")
      .get(this.shipmentController.getOne.bind(this.shipmentController))
      .put(this.shipmentController.updatePut.bind(this.shipmentController))
      .patch(this.shipmentController.updatePatch.bind(this.shipmentController))
      .delete(this.shipmentController.deletePhysical.bind(this.shipmentController));

    app
      .route("/api/shipments/:id/deactivate")
      .patch(this.shipmentController.deleteLogical.bind(this.shipmentController));
  }
}

import { Application } from "express";
import { DeliveryProofController } from "./delivery-proof.controller";

export class DeliveryProofRoutes {
  public deliveryProofController: DeliveryProofController = new DeliveryProofController();

  public routes(app: Application): void {
    app
      .route("/api/delivery_proofs")
      .get(this.deliveryProofController.getAll.bind(this.deliveryProofController))
      .post(this.deliveryProofController.create.bind(this.deliveryProofController));

    app
      .route("/api/delivery_proofs/:id")
      .get(this.deliveryProofController.getOne.bind(this.deliveryProofController))
      .put(this.deliveryProofController.updatePut.bind(this.deliveryProofController))
      .patch(this.deliveryProofController.updatePatch.bind(this.deliveryProofController))
      .delete(this.deliveryProofController.deletePhysical.bind(this.deliveryProofController));

    app
      .route("/api/delivery_proofs/:id/deactivate")
      .patch(this.deliveryProofController.deleteLogical.bind(this.deliveryProofController));
  }
}

import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { DeliveryProofController } from "./delivery-proof.controller";

export class DeliveryProofRoutes {
  public deliveryProofController: DeliveryProofController = new DeliveryProofController();

  public routes(app: Application): void {
    app
      .route("/api/delivery_proofs")
      .get(authenticate, authorize, this.deliveryProofController.getAll.bind(this.deliveryProofController))
      .post(authenticate, authorize, this.deliveryProofController.create.bind(this.deliveryProofController));

    app
      .route("/api/delivery_proofs/:id")
      .get(authenticate, authorize, this.deliveryProofController.getOne.bind(this.deliveryProofController))
      .put(authenticate, authorize, this.deliveryProofController.updatePut.bind(this.deliveryProofController))
      .patch(authenticate, authorize, this.deliveryProofController.updatePatch.bind(this.deliveryProofController))
      .delete(authenticate, authorize, this.deliveryProofController.deletePhysical.bind(this.deliveryProofController));

    app
      .route("/api/delivery_proofs/:id/deactivate")
      .patch(authenticate, authorize, this.deliveryProofController.deleteLogical.bind(this.deliveryProofController));
  }
}

import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { AddressController } from "./address.controller";

export class AddressRoutes {
  public addressController: AddressController = new AddressController();

  public routes(app: Application): void {
    app
      .route("/api/address")
      .get(authenticate, authorize, this.addressController.getAll.bind(this.addressController))
      .post(authenticate, authorize, this.addressController.create.bind(this.addressController));

    app
      .route("/api/address/:id")
      .get(authenticate, authorize, this.addressController.getOne.bind(this.addressController))
      .put(authenticate, authorize, this.addressController.updatePut.bind(this.addressController))
      .patch(authenticate, authorize, this.addressController.updatePatch.bind(this.addressController))
      .delete(authenticate, authorize, this.addressController.deletePhysical.bind(this.addressController));

    app
      .route("/api/address/:id/deactivate")
      .patch(authenticate, authorize, this.addressController.deleteLogical.bind(this.addressController));
  }
}

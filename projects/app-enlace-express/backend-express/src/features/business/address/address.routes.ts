import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { AddressController } from "./address.controller";

export class AddressRoutes {
  public addressController: AddressController = new AddressController();

  public routes(app: Application): void {
    app
      .route("/api/address")
      .get( this.addressController.getAll.bind(this.addressController))
      .post( this.addressController.create.bind(this.addressController));

    app
      .route("/api/address/:id")
      .get( this.addressController.getOne.bind(this.addressController))
      .put( this.addressController.updatePut.bind(this.addressController))
      .patch( this.addressController.updatePatch.bind(this.addressController))
      .delete( this.addressController.deletePhysical.bind(this.addressController));

    app
      .route("/api/address/:id/deactivate")
      .patch( this.addressController.deleteLogical.bind(this.addressController));
  }
}

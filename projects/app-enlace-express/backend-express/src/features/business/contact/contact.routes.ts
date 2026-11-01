import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ContactController } from "./contact.controller";

export class ContactRoutes {
  public contactController: ContactController = new ContactController();

  public routes(app: Application): void {
    app
      .route("/api/contacts")
      .get(authenticate, authorize, this.contactController.getAll.bind(this.contactController))
      .post(authenticate, authorize, this.contactController.create.bind(this.contactController));

    app
      .route("/api/contacts/:id")
      .get(authenticate, authorize, this.contactController.getOne.bind(this.contactController))
      .put(authenticate, authorize, this.contactController.updatePut.bind(this.contactController))
      .patch(authenticate, authorize, this.contactController.updatePatch.bind(this.contactController))
      .delete(authenticate, authorize, this.contactController.deletePhysical.bind(this.contactController));

    app
      .route("/api/contacts/:id/deactivate")
      .patch(authenticate, authorize, this.contactController.deleteLogical.bind(this.contactController));
  }
}

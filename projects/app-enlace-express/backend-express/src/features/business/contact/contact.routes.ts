import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ContactController } from "./contact.controller";

export class ContactRoutes {
  public contactController: ContactController = new ContactController();

  public routes(app: Application): void {
    app
      .route("/api/contacts")
      .get(authenticate, this.contactController.getAll.bind(this.contactController))
      .post(authenticate, this.contactController.create.bind(this.contactController));

    app
      .route("/api/contacts/:id")
      .get(authenticate, this.contactController.getOne.bind(this.contactController))
      .put(authenticate, this.contactController.updatePut.bind(this.contactController))
      .patch(authenticate, this.contactController.updatePatch.bind(this.contactController))
      .delete(authenticate, this.contactController.deletePhysical.bind(this.contactController));

    app
      .route("/api/contacts/:id/deactivate")
      .patch(authenticate, this.contactController.deleteLogical.bind(this.contactController));
  }
}

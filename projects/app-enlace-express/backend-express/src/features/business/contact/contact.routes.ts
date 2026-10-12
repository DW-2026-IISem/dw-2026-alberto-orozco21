import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ContactController } from "./contact.controller";

export class ContactRoutes {
  public contactController: ContactController = new ContactController();

  public routes(app: Application): void {
    app
      .route("/api/contacts")
      .get(this.contactController.getAll.bind(this.contactController))
      .post(this.contactController.create.bind(this.contactController));

    app
      .route("/api/contacts/:id")
      .get(this.contactController.getOne.bind(this.contactController))
      .put(this.contactController.updatePut.bind(this.contactController))
      .patch(this.contactController.updatePatch.bind(this.contactController))
      .delete(this.contactController.deletePhysical.bind(this.contactController));

    app
      .route("/api/contacts/:id/deactivate")
      .patch(this.contactController.deleteLogical.bind(this.contactController));
  }
}

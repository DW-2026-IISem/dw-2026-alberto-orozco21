import { Application } from "express";
import { MessengerController } from "./messenger.controller";

export class MessengerRoutes {
  public messengerController: MessengerController = new MessengerController();

  public routes(app: Application): void {
    app
      .route("/api/messengers")
      .get(this.messengerController.getAll.bind(this.messengerController))
      .post(this.messengerController.create.bind(this.messengerController));

    app
      .route("/api/messengers/:id")
      .get(this.messengerController.getOne.bind(this.messengerController))
      .put(this.messengerController.updatePut.bind(this.messengerController))
      .patch(this.messengerController.updatePatch.bind(this.messengerController))
      .delete(this.messengerController.deletePhysical.bind(this.messengerController));

    app
      .route("/api/messengers/:id/deactivate")
      .patch(this.messengerController.deleteLogical.bind(this.messengerController));
  }
}

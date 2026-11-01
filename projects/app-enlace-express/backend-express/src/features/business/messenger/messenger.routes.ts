import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { MessengerController } from "./messenger.controller";

export class MessengerRoutes {
  public messengerController: MessengerController = new MessengerController();

  public routes(app: Application): void {
    app
      .route("/api/messengers")
      .get(authenticate, authorize, this.messengerController.getAll.bind(this.messengerController))
      .post(authenticate, authorize, this.messengerController.create.bind(this.messengerController));

    app
      .route("/api/messengers/:id")
      .get(authenticate, authorize, this.messengerController.getOne.bind(this.messengerController))
      .put(authenticate, authorize, this.messengerController.updatePut.bind(this.messengerController))
      .patch(authenticate, authorize, this.messengerController.updatePatch.bind(this.messengerController))
      .delete(authenticate, authorize, this.messengerController.deletePhysical.bind(this.messengerController));

    app
      .route("/api/messengers/:id/deactivate")
      .patch(authenticate, authorize, this.messengerController.deleteLogical.bind(this.messengerController));
  }
}

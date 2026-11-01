import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { TrackingEventController } from "./tracking-event.controller";

export class TrackingEventRoutes {
  public trackingEventController: TrackingEventController = new TrackingEventController();

  public routes(app: Application): void {
    app
      .route("/api/tracking_events")
      .get(authenticate, authorize, this.trackingEventController.getAll.bind(this.trackingEventController))
      .post(authenticate, authorize, this.trackingEventController.create.bind(this.trackingEventController));

    app
      .route("/api/tracking_events/:id")
      .get(authenticate, authorize, this.trackingEventController.getOne.bind(this.trackingEventController))
      .put(authenticate, authorize, this.trackingEventController.updatePut.bind(this.trackingEventController))
      .patch(authenticate, authorize, this.trackingEventController.updatePatch.bind(this.trackingEventController))
      .delete(authenticate, authorize, this.trackingEventController.deletePhysical.bind(this.trackingEventController));

    app
      .route("/api/tracking_events/:id/deactivate")
      .patch(authenticate, authorize, this.trackingEventController.deleteLogical.bind(this.trackingEventController));
  }
}

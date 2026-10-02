import { Application } from "express";
import { TrackingEventController } from "./tracking-event.controller";

export class TrackingEventRoutes {
  public trackingEventController: TrackingEventController = new TrackingEventController();

  public routes(app: Application): void {
    app
      .route("/api/tracking_events")
      .get(this.trackingEventController.getAll.bind(this.trackingEventController))
      .post(this.trackingEventController.create.bind(this.trackingEventController));

    app
      .route("/api/tracking_events/:id")
      .get(this.trackingEventController.getOne.bind(this.trackingEventController))
      .put(this.trackingEventController.updatePut.bind(this.trackingEventController))
      .patch(this.trackingEventController.updatePatch.bind(this.trackingEventController))
      .delete(this.trackingEventController.deletePhysical.bind(this.trackingEventController));

    app
      .route("/api/tracking_events/:id/deactivate")
      .patch(this.trackingEventController.deleteLogical.bind(this.trackingEventController));
  }
}

import { Application } from "express";
import { RouteController } from "./route.controller";

export class RouteRoutes {
  public routeController: RouteController = new RouteController();

  public routes(app: Application): void {
    app
      .route("/api/routes")
      .get(this.routeController.getAll.bind(this.routeController))
      .post(this.routeController.create.bind(this.routeController));

    app
      .route("/api/routes/:id")
      .get(this.routeController.getOne.bind(this.routeController))
      .put(this.routeController.updatePut.bind(this.routeController))
      .patch(this.routeController.updatePatch.bind(this.routeController))
      .delete(this.routeController.deletePhysical.bind(this.routeController));

    app
      .route("/api/routes/:id/deactivate")
      .patch(this.routeController.deleteLogical.bind(this.routeController));
  }
}

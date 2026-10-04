import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { RouteController } from "./route.controller";

export class RouteRoutes {
  public routeController: RouteController = new RouteController();

  public routes(app: Application): void {
    app
      .route("/api/routes")
      .get(authenticate, authorize, this.routeController.getAll.bind(this.routeController))
      .post(authenticate, authorize, this.routeController.create.bind(this.routeController));

    app
      .route("/api/routes/:id")
      .get(authenticate, authorize, this.routeController.getOne.bind(this.routeController))
      .put(authenticate, authorize, this.routeController.updatePut.bind(this.routeController))
      .patch(authenticate, authorize, this.routeController.updatePatch.bind(this.routeController))
      .delete(authenticate, authorize, this.routeController.deletePhysical.bind(this.routeController));

    app
      .route("/api/routes/:id/deactivate")
      .patch(authenticate, authorize, this.routeController.deleteLogical.bind(this.routeController));
  }
}

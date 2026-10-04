import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { CompaniesController } from "./companies.controller";

export class CompaniesRoutes {
  public companiesController: CompaniesController = new CompaniesController();

  public routes(app: Application): void {
    app
      .route("/api/companies")
      .get(authenticate, authorize, this.companiesController.getAll.bind(this.companiesController))
      .post(authenticate, authorize, this.companiesController.create.bind(this.companiesController));

    app
      .route("/api/companies/:id")
      .get(authenticate, authorize, this.companiesController.getOne.bind(this.companiesController))
      .put(authenticate, authorize, this.companiesController.updatePut.bind(this.companiesController))
      .patch(authenticate, authorize, this.companiesController.updatePatch.bind(this.companiesController))
      .delete(authenticate, authorize, this.companiesController.deletePhysical.bind(this.companiesController));

    app
      .route("/api/companies/:id/deactivate")
      .patch(authenticate, authorize, this.companiesController.deleteLogical.bind(this.companiesController));
  }
}

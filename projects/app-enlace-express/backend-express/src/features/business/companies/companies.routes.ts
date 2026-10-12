import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { CompaniesController } from "./companies.controller";

export class CompaniesRoutes {
  public companiesController: CompaniesController = new CompaniesController();

  public routes(app: Application): void {
    app
      .route("/api/companies")
      .get(authenticate, this.companiesController.getAll.bind(this.companiesController))
      .post(authenticate, this.companiesController.create.bind(this.companiesController));

    app
      .route("/api/companies/:id")
      .get(authenticate, this.companiesController.getOne.bind(this.companiesController))
      .put(authenticate, this.companiesController.updatePut.bind(this.companiesController))
      .patch(authenticate, this.companiesController.updatePatch.bind(this.companiesController))
      .delete(authenticate, this.companiesController.deletePhysical.bind(this.companiesController));

    app
      .route("/api/companies/:id/deactivate")
      .patch(authenticate, this.companiesController.deleteLogical.bind(this.companiesController));
  }
}

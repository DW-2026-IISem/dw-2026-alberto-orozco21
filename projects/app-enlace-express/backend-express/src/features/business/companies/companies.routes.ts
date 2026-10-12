import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { CompaniesController } from "./companies.controller";

export class CompaniesRoutes {
  public companiesController: CompaniesController = new CompaniesController();

  public routes(app: Application): void {
    app
      .route("/api/companies")
      .get(this.companiesController.getAll.bind(this.companiesController))
      .post(this.companiesController.create.bind(this.companiesController));

    app
      .route("/api/companies/:id")
      .get(this.companiesController.getOne.bind(this.companiesController))
      .put(this.companiesController.updatePut.bind(this.companiesController))
      .patch(this.companiesController.updatePatch.bind(this.companiesController))
      .delete(this.companiesController.deletePhysical.bind(this.companiesController));

    app
      .route("/api/companies/:id/deactivate")
      .patch(this.companiesController.deleteLogical.bind(this.companiesController));
  }
}

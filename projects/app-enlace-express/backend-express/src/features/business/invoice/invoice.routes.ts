import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { InvoiceController } from "./invoice.controller";

export class InvoiceRoutes {
  public invoiceController: InvoiceController = new InvoiceController();

  public routes(app: Application): void {
    app
      .route("/api/invoices")
      .get(authenticate, authorize, this.invoiceController.getAll.bind(this.invoiceController))
      .post(authenticate, authorize, this.invoiceController.create.bind(this.invoiceController));

    app
      .route("/api/invoices/:id")
      .get(authenticate, authorize, this.invoiceController.getOne.bind(this.invoiceController))
      .put(authenticate, authorize, this.invoiceController.updatePut.bind(this.invoiceController))
      .patch(authenticate, authorize, this.invoiceController.updatePatch.bind(this.invoiceController))
      .delete(authenticate, authorize, this.invoiceController.deletePhysical.bind(this.invoiceController));

    app
      .route("/api/invoices/:id/deactivate")
      .patch(authenticate, authorize, this.invoiceController.deleteLogical.bind(this.invoiceController));
  }
}

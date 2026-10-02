import { Application } from "express";
import { InvoiceController } from "./invoice.controller";

export class InvoiceRoutes {
  public invoiceController: InvoiceController = new InvoiceController();

  public routes(app: Application): void {
    app
      .route("/api/invoices")
      .get(this.invoiceController.getAll.bind(this.invoiceController))
      .post(this.invoiceController.create.bind(this.invoiceController));

    app
      .route("/api/invoices/:id")
      .get(this.invoiceController.getOne.bind(this.invoiceController))
      .put(this.invoiceController.updatePut.bind(this.invoiceController))
      .patch(this.invoiceController.updatePatch.bind(this.invoiceController))
      .delete(this.invoiceController.deletePhysical.bind(this.invoiceController));

    app
      .route("/api/invoices/:id/deactivate")
      .patch(this.invoiceController.deleteLogical.bind(this.invoiceController));
  }
}

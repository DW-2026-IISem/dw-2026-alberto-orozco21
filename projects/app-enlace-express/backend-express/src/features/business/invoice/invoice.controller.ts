import { Request, Response } from "express";
import { Company } from "../companies/companies.model";
import { Invoice, InvoiceI } from "./invoice.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function companyExists(empresaId: number | undefined | null): Promise<boolean> {
  if (empresaId === undefined || empresaId === null) {
    return true;
  }
  return Boolean(await Company.findByPk(empresaId));
}

export class InvoiceController {
  public async getAll(_req: Request, res: Response) {
    try {
      const invoices = await Invoice.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ invoices });
    } catch (error) {
      res.status(500).json({ error: "Error fetching invoices", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }
      res.status(200).json({ invoice });
    } catch (error) {
      res.status(500).json({ error: "Error fetching invoice", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as InvoiceI;
      if (!(await companyExists(body.empresa_id))) {
        res.status(404).json({ error: "Company (empresa_id) not found" });
        return;
      }

      const invoice = await Invoice.create({
        numero: body.numero,
        empresa_id: body.empresa_id,
        periodo_desde: body.periodo_desde,
        periodo_hasta: body.periodo_hasta,
        fecha: body.fecha,
        subtotal: body.subtotal,
        impuestos: body.impuestos ?? null,
        total: body.total,
        estado: body.estado,
        fecha_pago: body.fecha_pago ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ invoice });
    } catch (error) {
      res.status(500).json({ error: "Error creating invoice", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as InvoiceI;
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }
      if (!(await companyExists(body.empresa_id))) {
        res.status(404).json({ error: "Company (empresa_id) not found" });
        return;
      }

      await invoice.update({
        numero: body.numero,
        empresa_id: body.empresa_id,
        periodo_desde: body.periodo_desde,
        periodo_hasta: body.periodo_hasta,
        fecha: body.fecha,
        subtotal: body.subtotal,
        impuestos: body.impuestos ?? invoice.impuestos,
        total: body.total,
        estado: body.estado,
        fecha_pago: body.fecha_pago ?? invoice.fecha_pago,
        is_active: body.is_active ?? invoice.is_active,
      });
      res.status(200).json({ invoice });
    } catch (error) {
      res.status(500).json({ error: "Error updating invoice (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<InvoiceI>;
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }
      if (!(await companyExists(body.empresa_id))) {
        res.status(404).json({ error: "Company (empresa_id) not found" });
        return;
      }

      await invoice.update(body);
      res.status(200).json({ invoice });
    } catch (error) {
      res.status(500).json({ error: "Error updating invoice (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }
      await invoice.destroy();
      res.status(200).json({ message: "Invoice permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting invoice", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }
      await invoice.update({ is_active: false });
      res.status(200).json({
        message: "Invoice deactivated (logical delete)",
        invoice,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating invoice", detail: String(error) });
    }
  }
}

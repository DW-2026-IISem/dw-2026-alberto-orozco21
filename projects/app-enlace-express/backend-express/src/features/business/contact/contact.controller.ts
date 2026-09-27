import { Request, Response } from "express";
import { Contact, ContactI } from "./contact.model";
import { Company } from "../companies/companies.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class ContactController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const contacts = await Contact.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ contacts });
    } catch (error) {
      res.status(500).json({ error: "Error fetching contacts", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }
      res.status(200).json({ contact: contact });
    } catch (error) {
      res.status(500).json({ error: "Error fetching contact", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ContactI;
      if (body.empresa_id !== undefined && body.empresa_id !== null) {
        const found_empresa_id = await Company.findByPk(body.empresa_id);
        if (!found_empresa_id) {
          res.status(404).json({ error: "Company (empresa_id) not found" });
          return;
        }
      }

      const contact = await Contact.create({
        empresa_id: body.empresa_id,
        nombre: body.nombre,
        cargo: body.cargo ?? null,
        telefono: body.telefono ?? null,
        email: body.email ?? null,
        is_principal: body.is_principal ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ contact: contact });
    } catch (error) {
      res.status(500).json({ error: "Error creating contact", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ContactI;
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }
      if (body.empresa_id !== undefined && body.empresa_id !== null) {
        const found_empresa_id = await Company.findByPk(body.empresa_id);
        if (!found_empresa_id) {
          res.status(404).json({ error: "Company (empresa_id) not found" });
          return;
        }
      }

      await contact.update({
        empresa_id: body.empresa_id,
        nombre: body.nombre,
        cargo: body.cargo ?? contact.cargo,
        telefono: body.telefono ?? contact.telefono,
        email: body.email ?? contact.email,
        is_principal: body.is_principal ?? contact.is_principal,
        is_active: body.is_active ?? contact.is_active,
      });

      res.status(200).json({ contact: contact });
    } catch (error) {
      res.status(500).json({ error: "Error updating contact (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ContactI>;
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }

      await contact.update(body);
      res.status(200).json({ contact: contact });
    } catch (error) {
      res.status(500).json({ error: "Error updating contact (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }
      await contact.destroy();
      res.status(200).json({ message: "Contact permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting contact", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }
      await contact.update({ is_active: false });
      res.status(200).json({
        message: "Contact deactivated (logical delete)",
        contact: contact,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating contact", detail: String(error) });
    }
  }
}

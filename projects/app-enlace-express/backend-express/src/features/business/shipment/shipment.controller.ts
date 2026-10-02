import { Request, Response } from "express";
import { Address } from "../address/address.model";
import { Company } from "../companies/companies.model";
import { Contact } from "../contact/contact.model";
import { Messenger } from "../messenger/messenger.model";
import { Rate } from "../rate/rate.model";
import { Route } from "../route/route.model";
import { Shipment, ShipmentI } from "./shipment.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function missingReference(body: Partial<ShipmentI>): Promise<string | null> {
  const checks: Array<[number | null | undefined, () => Promise<unknown>, string]> = [
    [body.empresa_id, () => Company.findByPk(body.empresa_id!), "Company (empresa_id)"],
    [body.contacto_origen_id, () => Contact.findByPk(body.contacto_origen_id!), "Contact (contacto_origen_id)"],
    [body.direccion_origen_id, () => Address.findByPk(body.direccion_origen_id!), "Address (direccion_origen_id)"],
    [body.contacto_destino_id, () => Contact.findByPk(body.contacto_destino_id!), "Contact (contacto_destino_id)"],
    [body.direccion_destino_id, () => Address.findByPk(body.direccion_destino_id!), "Address (direccion_destino_id)"],
    [body.mensajero_id, () => Messenger.findByPk(body.mensajero_id!), "Messenger (mensajero_id)"],
    [body.ruta_id, () => Route.findByPk(body.ruta_id!), "Route (ruta_id)"],
    [body.tarifa_id, () => Rate.findByPk(body.tarifa_id!), "Rate (tarifa_id)"],
  ];

  for (const [id, find, label] of checks) {
    if (id !== undefined && id !== null && !(await find())) {
      return label;
    }
  }
  return null;
}

export class ShipmentController {
  public async getAll(_req: Request, res: Response) {
    try {
      const shipments = await Shipment.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ shipments });
    } catch (error) {
      res.status(500).json({ error: "Error fetching shipments", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }
      res.status(200).json({ shipment });
    } catch (error) {
      res.status(500).json({ error: "Error fetching shipment", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ShipmentI;
      const missing = await missingReference(body);
      if (missing) {
        res.status(404).json({ error: `${missing} not found` });
        return;
      }

      const shipment = await Shipment.create({
        numero_guia: body.numero_guia,
        empresa_id: body.empresa_id,
        contacto_origen_id: body.contacto_origen_id,
        direccion_origen_id: body.direccion_origen_id,
        contacto_destino_id: body.contacto_destino_id,
        direccion_destino_id: body.direccion_destino_id,
        mensajero_id: body.mensajero_id ?? null,
        ruta_id: body.ruta_id ?? null,
        tarifa_id: body.tarifa_id,
        prioridad: body.prioridad,
        peso_total_kg: body.peso_total_kg,
        valor_declarado: body.valor_declarado ?? null,
        costo_calculado: body.costo_calculado ?? null,
        estado: body.estado,
        fecha_solicitud: body.fecha_solicitud,
        fecha_entrega_estimada: body.fecha_entrega_estimada ?? null,
        fecha_entrega_real: body.fecha_entrega_real ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ shipment });
    } catch (error) {
      res.status(500).json({ error: "Error creating shipment", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ShipmentI;
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }

      const missing = await missingReference(body);
      if (missing) {
        res.status(404).json({ error: `${missing} not found` });
        return;
      }

      await shipment.update({
        numero_guia: body.numero_guia,
        empresa_id: body.empresa_id,
        contacto_origen_id: body.contacto_origen_id,
        direccion_origen_id: body.direccion_origen_id,
        contacto_destino_id: body.contacto_destino_id,
        direccion_destino_id: body.direccion_destino_id,
        mensajero_id: body.mensajero_id ?? shipment.mensajero_id,
        ruta_id: body.ruta_id ?? shipment.ruta_id,
        tarifa_id: body.tarifa_id,
        prioridad: body.prioridad,
        peso_total_kg: body.peso_total_kg,
        valor_declarado: body.valor_declarado ?? shipment.valor_declarado,
        costo_calculado: body.costo_calculado ?? shipment.costo_calculado,
        estado: body.estado,
        fecha_solicitud: body.fecha_solicitud,
        fecha_entrega_estimada: body.fecha_entrega_estimada ?? shipment.fecha_entrega_estimada,
        fecha_entrega_real: body.fecha_entrega_real ?? shipment.fecha_entrega_real,
        is_active: body.is_active ?? shipment.is_active,
      });
      res.status(200).json({ shipment });
    } catch (error) {
      res.status(500).json({ error: "Error updating shipment (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ShipmentI>;
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }

      const missing = await missingReference(body);
      if (missing) {
        res.status(404).json({ error: `${missing} not found` });
        return;
      }

      await shipment.update(body);
      res.status(200).json({ shipment });
    } catch (error) {
      res.status(500).json({ error: "Error updating shipment (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }
      await shipment.destroy();
      res.status(200).json({ message: "Shipment permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting shipment", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }
      await shipment.update({ is_active: false });
      res.status(200).json({
        message: "Shipment deactivated (logical delete)",
        shipment,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating shipment", detail: String(error) });
    }
  }
}

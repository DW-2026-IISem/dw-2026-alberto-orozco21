import { Request, Response } from "express";
import { Messenger, MessengerI } from "./messenger.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class MessengerController {
  public async getAll(_req: Request, res: Response) {
    try {
      const messengers = await Messenger.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ messengers });
    } catch (error) {
      res.status(500).json({ error: "Error fetching messengers", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }
      res.status(200).json({ messenger });
    } catch (error) {
      res.status(500).json({ error: "Error fetching messenger", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as MessengerI;
      const messenger = await Messenger.create({
        nombre: body.nombre,
        documento_identidad: body.documento_identidad,
        telefono: body.telefono ?? null,
        tipo_vehiculo: body.tipo_vehiculo,
        placa_vehiculo: body.placa_vehiculo ?? null,
        zona_asignada: body.zona_asignada ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ messenger });
    } catch (error) {
      res.status(500).json({ error: "Error creating messenger", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as MessengerI;
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }

      await messenger.update({
        nombre: body.nombre,
        documento_identidad: body.documento_identidad,
        telefono: body.telefono ?? messenger.telefono,
        tipo_vehiculo: body.tipo_vehiculo,
        placa_vehiculo: body.placa_vehiculo ?? messenger.placa_vehiculo,
        zona_asignada: body.zona_asignada ?? messenger.zona_asignada,
        is_active: body.is_active ?? messenger.is_active,
      });
      res.status(200).json({ messenger });
    } catch (error) {
      res.status(500).json({ error: "Error updating messenger (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<MessengerI>;
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }

      await messenger.update(body);
      res.status(200).json({ messenger });
    } catch (error) {
      res.status(500).json({ error: "Error updating messenger (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }
      await messenger.destroy();
      res.status(200).json({ message: "Messenger permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting messenger", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }
      await messenger.update({ is_active: false });
      res.status(200).json({
        message: "Messenger deactivated (logical delete)",
        messenger,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating messenger", detail: String(error) });
    }
  }
}

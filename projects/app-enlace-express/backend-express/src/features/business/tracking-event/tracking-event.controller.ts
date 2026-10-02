import { Request, Response } from "express";
import { Messenger } from "../messenger/messenger.model";
import { Shipment } from "../shipment/shipment.model";
import { TrackingEvent, TrackingEventI } from "./tracking-event.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function missingReference(body: Partial<TrackingEventI>): Promise<string | null> {
  if (body.envio_id !== undefined && body.envio_id !== null) {
    const shipment = await Shipment.findByPk(body.envio_id);
    if (!shipment) {
      return "Shipment (envio_id)";
    }
  }
  if (body.registrado_por_id !== undefined && body.registrado_por_id !== null) {
    const messenger = await Messenger.findByPk(body.registrado_por_id);
    if (!messenger) {
      return "Messenger (registrado_por_id)";
    }
  }
  return null;
}

export class TrackingEventController {
  public async getAll(_req: Request, res: Response) {
    try {
      const tracking_events = await TrackingEvent.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ tracking_events });
    } catch (error) {
      res.status(500).json({ error: "Error fetching tracking_events", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }
      res.status(200).json({ trackingEvent });
    } catch (error) {
      res.status(500).json({ error: "Error fetching trackingEvent", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as TrackingEventI;
      const missing = await missingReference(body);
      if (missing) {
        res.status(404).json({ error: `${missing} not found` });
        return;
      }

      const trackingEvent = await TrackingEvent.create({
        envio_id: body.envio_id,
        tipo: body.tipo,
        fecha: body.fecha,
        ubicacion: body.ubicacion ?? null,
        observaciones: body.observaciones ?? null,
        estado: body.estado,
        registrado_por_id: body.registrado_por_id ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ trackingEvent });
    } catch (error) {
      res.status(500).json({ error: "Error creating trackingEvent", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as TrackingEventI;
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }
      const missing = await missingReference(body);
      if (missing) {
        res.status(404).json({ error: `${missing} not found` });
        return;
      }

      await trackingEvent.update({
        envio_id: body.envio_id,
        tipo: body.tipo,
        fecha: body.fecha,
        ubicacion: body.ubicacion ?? trackingEvent.ubicacion,
        observaciones: body.observaciones ?? trackingEvent.observaciones,
        estado: body.estado,
        registrado_por_id: body.registrado_por_id ?? trackingEvent.registrado_por_id,
        is_active: body.is_active ?? trackingEvent.is_active,
      });
      res.status(200).json({ trackingEvent });
    } catch (error) {
      res.status(500).json({ error: "Error updating trackingEvent (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<TrackingEventI>;
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }
      const missing = await missingReference(body);
      if (missing) {
        res.status(404).json({ error: `${missing} not found` });
        return;
      }

      await trackingEvent.update(body);
      res.status(200).json({ trackingEvent });
    } catch (error) {
      res.status(500).json({ error: "Error updating trackingEvent (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }
      await trackingEvent.destroy();
      res.status(200).json({ message: "TrackingEvent permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting trackingEvent", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }
      await trackingEvent.update({ is_active: false });
      res.status(200).json({
        message: "TrackingEvent deactivated (logical delete)",
        trackingEvent,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating trackingEvent", detail: String(error) });
    }
  }
}

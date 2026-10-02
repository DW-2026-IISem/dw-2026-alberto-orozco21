import { Request, Response } from "express";
import { Messenger } from "../messenger/messenger.model";
import { Route, RouteI } from "./route.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class RouteController {
  public async getAll(_req: Request, res: Response) {
    try {
      const routes = await Route.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ routes });
    } catch (error) {
      res.status(500).json({ error: "Error fetching routes", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }
      res.status(200).json({ route });
    } catch (error) {
      res.status(500).json({ error: "Error fetching route", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as RouteI;
      const messenger = await Messenger.findByPk(body.mensajero_id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger (mensajero_id) not found" });
        return;
      }

      const route = await Route.create({
        nombre: body.nombre,
        mensajero_id: body.mensajero_id,
        zona_cobertura: body.zona_cobertura ?? null,
        fecha: body.fecha,
        hora_inicio: body.hora_inicio ?? null,
        hora_fin: body.hora_fin ?? null,
        estado: body.estado,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ route });
    } catch (error) {
      res.status(500).json({ error: "Error creating route", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as RouteI;
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }
      const messenger = await Messenger.findByPk(body.mensajero_id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger (mensajero_id) not found" });
        return;
      }

      await route.update({
        nombre: body.nombre,
        mensajero_id: body.mensajero_id,
        zona_cobertura: body.zona_cobertura ?? route.zona_cobertura,
        fecha: body.fecha,
        hora_inicio: body.hora_inicio ?? route.hora_inicio,
        hora_fin: body.hora_fin ?? route.hora_fin,
        estado: body.estado,
        is_active: body.is_active ?? route.is_active,
      });
      res.status(200).json({ route });
    } catch (error) {
      res.status(500).json({ error: "Error updating route (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<RouteI>;
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }
      if (body.mensajero_id !== undefined) {
        const messenger = await Messenger.findByPk(body.mensajero_id);
        if (!messenger) {
          res.status(404).json({ error: "Messenger (mensajero_id) not found" });
          return;
        }
      }

      await route.update(body);
      res.status(200).json({ route });
    } catch (error) {
      res.status(500).json({ error: "Error updating route (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }
      await route.destroy();
      res.status(200).json({ message: "Route permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting route", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }
      await route.update({ is_active: false });
      res.status(200).json({
        message: "Route deactivated (logical delete)",
        route,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating route", detail: String(error) });
    }
  }
}

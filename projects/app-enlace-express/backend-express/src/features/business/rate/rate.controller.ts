import { Request, Response } from "express";
import { Rate, RateI } from "./rate.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class RateController {
  public async getAll(_req: Request, res: Response) {
    try {
      const rates = await Rate.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ rates });
    } catch (error) {
      res.status(500).json({ error: "Error fetching rates", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }
      res.status(200).json({ rate });
    } catch (error) {
      res.status(500).json({ error: "Error fetching rate", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as RateI;
      const rate = await Rate.create({
        nombre: body.nombre,
        zona: body.zona,
        regla_calculo: body.regla_calculo,
        valor_base: body.valor_base,
        valor_por_kg_adicional: body.valor_por_kg_adicional ?? null,
        recargo_urgente_pct: body.recargo_urgente_pct ?? null,
        vigencia_desde: body.vigencia_desde,
        vigencia_hasta: body.vigencia_hasta ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ rate });
    } catch (error) {
      res.status(500).json({ error: "Error creating rate", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as RateI;
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }

      await rate.update({
        nombre: body.nombre,
        zona: body.zona,
        regla_calculo: body.regla_calculo,
        valor_base: body.valor_base,
        valor_por_kg_adicional: body.valor_por_kg_adicional ?? rate.valor_por_kg_adicional,
        recargo_urgente_pct: body.recargo_urgente_pct ?? rate.recargo_urgente_pct,
        vigencia_desde: body.vigencia_desde,
        vigencia_hasta: body.vigencia_hasta ?? rate.vigencia_hasta,
        is_active: body.is_active ?? rate.is_active,
      });
      res.status(200).json({ rate });
    } catch (error) {
      res.status(500).json({ error: "Error updating rate (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<RateI>;
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }

      await rate.update(body);
      res.status(200).json({ rate });
    } catch (error) {
      res.status(500).json({ error: "Error updating rate (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }
      await rate.destroy();
      res.status(200).json({ message: "Rate permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting rate", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }
      await rate.update({ is_active: false });
      res.status(200).json({
        message: "Rate deactivated (logical delete)",
        rate,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating rate", detail: String(error) });
    }
  }
}

import { Request, Response } from "express";
import { Shipment } from "../shipment/shipment.model";
import { Package, PackageI } from "./package.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PackageController {
  public async getAll(_req: Request, res: Response) {
    try {
      const packages = await Package.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ packages });
    } catch (error) {
      res.status(500).json({ error: "Error fetching packages", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      res.status(200).json({ package: pkg });
    } catch (error) {
      res.status(500).json({ error: "Error fetching package", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PackageI;
      const shipment = await Shipment.findByPk(body.envio_id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment (envio_id) not found" });
        return;
      }

      const pkg = await Package.create({
        envio_id: body.envio_id,
        descripcion_contenido: body.descripcion_contenido ?? null,
        peso_kg: body.peso_kg,
        alto_cm: body.alto_cm ?? null,
        ancho_cm: body.ancho_cm ?? null,
        largo_cm: body.largo_cm ?? null,
        valor_declarado: body.valor_declarado ?? null,
        es_fragil: body.es_fragil ?? false,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ package: pkg });
    } catch (error) {
      res.status(500).json({ error: "Error creating package", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PackageI;
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      const shipment = await Shipment.findByPk(body.envio_id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment (envio_id) not found" });
        return;
      }

      await pkg.update({
        envio_id: body.envio_id,
        descripcion_contenido: body.descripcion_contenido ?? pkg.descripcion_contenido,
        peso_kg: body.peso_kg,
        alto_cm: body.alto_cm ?? pkg.alto_cm,
        ancho_cm: body.ancho_cm ?? pkg.ancho_cm,
        largo_cm: body.largo_cm ?? pkg.largo_cm,
        valor_declarado: body.valor_declarado ?? pkg.valor_declarado,
        es_fragil: body.es_fragil ?? pkg.es_fragil,
        is_active: body.is_active ?? pkg.is_active,
      });
      res.status(200).json({ package: pkg });
    } catch (error) {
      res.status(500).json({ error: "Error updating package (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PackageI>;
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      if (body.envio_id !== undefined) {
        const shipment = await Shipment.findByPk(body.envio_id);
        if (!shipment) {
          res.status(404).json({ error: "Shipment (envio_id) not found" });
          return;
        }
      }

      await pkg.update(body);
      res.status(200).json({ package: pkg });
    } catch (error) {
      res.status(500).json({ error: "Error updating package (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      await pkg.destroy();
      res.status(200).json({ message: "Package permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting package", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      await pkg.update({ is_active: false });
      res.status(200).json({
        message: "Package deactivated (logical delete)",
        package: pkg,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating package", detail: String(error) });
    }
  }
}

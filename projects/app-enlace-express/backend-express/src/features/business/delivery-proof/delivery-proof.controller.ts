import { Request, Response } from "express";
import { Shipment } from "../shipment/shipment.model";
import { DeliveryProof, DeliveryProofI } from "./delivery-proof.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function validateShipment(
  envioId: number | null | undefined,
  currentProofId?: number
): Promise<string | null> {
  if (envioId === undefined || envioId === null) {
    return null;
  }

  const shipment = await Shipment.findByPk(envioId);
  if (!shipment) {
    return "Shipment (envio_id) not found";
  }

  const existingProof = await DeliveryProof.findOne({ where: { envio_id: envioId } });
  if (existingProof && existingProof.id !== currentProofId) {
    return "A delivery proof already exists for this shipment";
  }
  return null;
}

export class DeliveryProofController {
  public async getAll(_req: Request, res: Response) {
    try {
      const delivery_proofs = await DeliveryProof.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ delivery_proofs });
    } catch (error) {
      res.status(500).json({ error: "Error fetching delivery_proofs", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }
      res.status(200).json({ deliveryProof });
    } catch (error) {
      res.status(500).json({ error: "Error fetching deliveryProof", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as DeliveryProofI;
      const referenceError = await validateShipment(body.envio_id);
      if (referenceError) {
        res.status(404).json({ error: referenceError });
        return;
      }

      const deliveryProof = await DeliveryProof.create({
        envio_id: body.envio_id,
        fecha_hora: body.fecha_hora,
        receptor_nombre: body.receptor_nombre,
        receptor_documento: body.receptor_documento ?? null,
        firma_url: body.firma_url ?? null,
        foto_url: body.foto_url ?? null,
        geolocalizacion_lat: body.geolocalizacion_lat ?? null,
        geolocalizacion_lng: body.geolocalizacion_lng ?? null,
        observaciones: body.observaciones ?? null,
        estado: body.estado,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ deliveryProof });
    } catch (error) {
      res.status(500).json({ error: "Error creating deliveryProof", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as DeliveryProofI;
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }

      const referenceError = await validateShipment(body.envio_id, deliveryProof.id);
      if (referenceError) {
        res.status(404).json({ error: referenceError });
        return;
      }

      await deliveryProof.update({
        envio_id: body.envio_id,
        fecha_hora: body.fecha_hora,
        receptor_nombre: body.receptor_nombre,
        receptor_documento: body.receptor_documento ?? deliveryProof.receptor_documento,
        firma_url: body.firma_url ?? deliveryProof.firma_url,
        foto_url: body.foto_url ?? deliveryProof.foto_url,
        geolocalizacion_lat: body.geolocalizacion_lat ?? deliveryProof.geolocalizacion_lat,
        geolocalizacion_lng: body.geolocalizacion_lng ?? deliveryProof.geolocalizacion_lng,
        observaciones: body.observaciones ?? deliveryProof.observaciones,
        estado: body.estado,
        is_active: body.is_active ?? deliveryProof.is_active,
      });
      res.status(200).json({ deliveryProof });
    } catch (error) {
      res.status(500).json({ error: "Error updating deliveryProof (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<DeliveryProofI>;
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }

      const referenceError = await validateShipment(body.envio_id, deliveryProof.id);
      if (referenceError) {
        res.status(404).json({ error: referenceError });
        return;
      }

      await deliveryProof.update(body);
      res.status(200).json({ deliveryProof });
    } catch (error) {
      res.status(500).json({ error: "Error updating deliveryProof (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }
      await deliveryProof.destroy();
      res.status(200).json({ message: "DeliveryProof permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting deliveryProof", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }
      await deliveryProof.update({ is_active: false });
      res.status(200).json({
        message: "DeliveryProof deactivated (logical delete)",
        deliveryProof,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating deliveryProof", detail: String(error) });
    }
  }
}

import { Shipment } from "../shipment/shipment.model";
import { DeliveryProof } from "./delivery-proof.model";

DeliveryProof.belongsTo(Shipment, { foreignKey: "envio_id", as: "shipment" });
Shipment.hasOne(DeliveryProof, { foreignKey: "envio_id", as: "deliveryProof" });

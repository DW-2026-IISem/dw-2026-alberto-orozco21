import { Shipment } from "../shipment/shipment.model";
import { Package } from "./package.model";

Package.belongsTo(Shipment, { foreignKey: "envio_id", as: "shipment" });
Shipment.hasMany(Package, { foreignKey: "envio_id", as: "packages" });

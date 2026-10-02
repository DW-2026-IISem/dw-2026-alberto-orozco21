import { Messenger } from "../messenger/messenger.model";
import { Shipment } from "../shipment/shipment.model";
import { TrackingEvent } from "./tracking-event.model";

TrackingEvent.belongsTo(Shipment, { foreignKey: "envio_id", as: "shipment" });
Shipment.hasMany(TrackingEvent, { foreignKey: "envio_id", as: "trackingEvents" });
TrackingEvent.belongsTo(Messenger, { foreignKey: "registrado_por_id", as: "registrado_por" });
Messenger.hasMany(TrackingEvent, {
  foreignKey: "registrado_por_id",
  as: "trackingEvents_registrado_por",
});

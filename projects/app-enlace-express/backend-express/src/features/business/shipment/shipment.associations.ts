import { Address } from "../address/address.model";
import { Company } from "../companies/companies.model";
import { Contact } from "../contact/contact.model";
import { Messenger } from "../messenger/messenger.model";
import { Rate } from "../rate/rate.model";
import { Route } from "../route/route.model";
import { Shipment } from "./shipment.model";

Shipment.belongsTo(Company, { foreignKey: "empresa_id", as: "company" });
Company.hasMany(Shipment, { foreignKey: "empresa_id", as: "shipments" });

Shipment.belongsTo(Contact, { foreignKey: "contacto_origen_id", as: "contacto_origen" });
Contact.hasMany(Shipment, { foreignKey: "contacto_origen_id", as: "shipments_contacto_origen" });

Shipment.belongsTo(Address, { foreignKey: "direccion_origen_id", as: "direccion_origen" });
Address.hasMany(Shipment, { foreignKey: "direccion_origen_id", as: "shipments_direccion_origen" });

Shipment.belongsTo(Contact, { foreignKey: "contacto_destino_id", as: "contacto_destino" });
Contact.hasMany(Shipment, { foreignKey: "contacto_destino_id", as: "shipments_contacto_destino" });

Shipment.belongsTo(Address, { foreignKey: "direccion_destino_id", as: "direccion_destino" });
Address.hasMany(Shipment, { foreignKey: "direccion_destino_id", as: "shipments_direccion_destino" });

Shipment.belongsTo(Messenger, { foreignKey: "mensajero_id", as: "messenger" });
Messenger.hasMany(Shipment, { foreignKey: "mensajero_id", as: "shipments" });

Shipment.belongsTo(Route, { foreignKey: "ruta_id", as: "route" });
Route.hasMany(Shipment, { foreignKey: "ruta_id", as: "shipments" });

Shipment.belongsTo(Rate, { foreignKey: "tarifa_id", as: "rate" });
Rate.hasMany(Shipment, { foreignKey: "tarifa_id", as: "shipments" });

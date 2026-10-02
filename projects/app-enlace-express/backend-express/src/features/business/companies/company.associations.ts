import { Company } from "./companies.model";
import { Contact } from "../contact/contact.model";
import { Address } from "../address/address.model";

Company.belongsTo(Contact, { foreignKey: "contacto_principal_id", as: "contacto_principal" });
Company.belongsTo(Address, { foreignKey: "direccion_facturacion_id", as: "direccion_facturacion" });

import { Address } from "./address.model";
import { Company } from "../companies/companies.model";

Address.belongsTo(Company, { foreignKey: "empresa_id", as: "company" });
Company.hasMany(Address, { foreignKey: "empresa_id", as: "addresss" });

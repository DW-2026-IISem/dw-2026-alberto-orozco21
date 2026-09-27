import { Contact } from "./contact.model";
import { Company } from "../company/company.model";

Contact.belongsTo(Company, { foreignKey: "empresa_id", as: "company" });
Company.hasMany(Contact, { foreignKey: "empresa_id", as: "contacts" });

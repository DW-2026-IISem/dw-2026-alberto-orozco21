import { Company } from "../companies/companies.model";
import { Invoice } from "./invoice.model";

Invoice.belongsTo(Company, { foreignKey: "empresa_id", as: "company" });
Company.hasMany(Invoice, { foreignKey: "empresa_id", as: "invoices" });

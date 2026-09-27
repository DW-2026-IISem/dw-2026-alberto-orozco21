import { CompaniesRoutes } from "../features/business/companies/companies.routes";
import { ContactRoutes } from "../features/business/contact/contact.routes";

export class Routes {
  public companiesRoutes: CompaniesRoutes = new CompaniesRoutes();
  public contactRoutes: ContactRoutes = new ContactRoutes();
}

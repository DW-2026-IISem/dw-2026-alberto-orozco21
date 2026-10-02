import { CompaniesRoutes } from "../features/business/companies/companies.routes";
import { ContactRoutes } from "../features/business/contact/contact.routes";
import { AddressRoutes } from "../features/business/address/address.routes";
import { MessengerRoutes } from "../features/business/messenger/messenger.routes";
import { RateRoutes } from "../features/business/rate/rate.routes";
import { RouteRoutes } from "../features/business/route/route.routes";
import { ShipmentRoutes } from "../features/business/shipment/shipment.routes";
import { PackageRoutes } from "../features/business/package/package.routes";
import { TrackingEventRoutes } from "../features/business/tracking-event/tracking-event.routes";

export class Routes {
  public companiesRoutes: CompaniesRoutes = new CompaniesRoutes();
  public contactRoutes: ContactRoutes = new ContactRoutes();
  public addressRoutes: AddressRoutes = new AddressRoutes();
  public messengerRoutes: MessengerRoutes = new MessengerRoutes();
  public rateRoutes: RateRoutes = new RateRoutes();
  public routeRoutes: RouteRoutes = new RouteRoutes();
  public shipmentRoutes: ShipmentRoutes = new ShipmentRoutes();
  public packageRoutes: PackageRoutes = new PackageRoutes();
  public trackingEventRoutes: TrackingEventRoutes = new TrackingEventRoutes();
}

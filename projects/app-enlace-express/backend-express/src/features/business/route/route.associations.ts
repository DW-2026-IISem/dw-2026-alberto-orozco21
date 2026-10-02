import { Messenger } from "../messenger/messenger.model";
import { Route } from "./route.model";

Route.belongsTo(Messenger, { foreignKey: "mensajero_id", as: "messenger" });
Messenger.hasMany(Route, { foreignKey: "mensajero_id", as: "routes" });

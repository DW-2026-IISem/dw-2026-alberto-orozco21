import { RefreshToken } from "./refresh-tokens/refresh-token.model";
import { ResourceRole } from "./resource-roles/resource-role.model";
import { Resource } from "./resources/resource.model";
import { RoleUser } from "./role-users/role-user.model";
import { Role } from "./roles/role.model";
import { User } from "./users/user.model";

ResourceRole.belongsTo(Role, { foreignKey: "role_id", as: "role" });
ResourceRole.belongsTo(Resource, { foreignKey: "resource_id", as: "resource" });
Role.hasMany(ResourceRole, { foreignKey: "role_id", as: "resource_roles" });
Resource.hasMany(ResourceRole, { foreignKey: "resource_id", as: "resource_roles" });

RoleUser.belongsTo(User, { foreignKey: "user_id", as: "user" });
RoleUser.belongsTo(Role, { foreignKey: "role_id", as: "role" });
User.hasMany(RoleUser, { foreignKey: "user_id", as: "role_users" });
Role.hasMany(RoleUser, { foreignKey: "role_id", as: "role_users" });

User.belongsToMany(Role, {
  through: RoleUser,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
});
Role.belongsToMany(User, {
  through: RoleUser,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users",
});

Role.belongsToMany(Resource, {
  through: ResourceRole,
  foreignKey: "role_id",
  otherKey: "resource_id",
  as: "resources",
});
Resource.belongsToMany(Role, {
  through: ResourceRole,
  foreignKey: "resource_id",
  otherKey: "role_id",
  as: "roles",
});

RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(RefreshToken, { foreignKey: "user_id", as: "refresh_tokens" });

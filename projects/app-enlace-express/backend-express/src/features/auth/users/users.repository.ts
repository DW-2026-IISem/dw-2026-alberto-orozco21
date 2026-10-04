import { CreationAttributes, Op } from "sequelize";
import { sequelize } from "../../../database/db";
import { RefreshToken } from "../refresh-tokens/refresh-token.model";
import { RoleUser } from "../role-users/role-user.model";
import { User } from "./user.model";
import { UserI } from "./user.model";

export class UsersRepository {
  private static readonly WITHOUT_PASSWORD = { exclude: ["password"] };

  public async findAllActive(): Promise<User[]> {
    return User.findAll({
      where: { status: "active" },
      attributes: UsersRepository.WITHOUT_PASSWORD,
      order: [["id", "ASC"]],
    });
  }

  public async findById(id: number): Promise<User | null> {
    return User.findByPk(id, { attributes: UsersRepository.WITHOUT_PASSWORD });
  }

  public async findByIdWithPassword(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  public async findByUsernameOrEmail(
    identifier: string,
    includePassword = false
  ): Promise<User | null> {
    const value = identifier.trim().toLowerCase();
    return User.findOne({
      where: { [Op.or]: [{ username: value }, { email: value }] },
      ...(includePassword ? {} : { attributes: UsersRepository.WITHOUT_PASSWORD }),
    });
  }

  public findByIdentifierWithPassword(identifier: string): Promise<User | null> {
    return this.findByUsernameOrEmail(identifier, true);
  }

  public async findConflicts(username: string, email: string): Promise<User[]> {
    return User.findAll({
      where: {
        [Op.or]: [
          { username: username.trim().toLowerCase() },
          { email: email.trim().toLowerCase() },
        ],
      },
      attributes: ["id", "username", "email"],
    });
  }

  public async create(data: CreationAttributes<User>): Promise<User> {
    return User.create(data);
  }

  public async update(user: User, data: Partial<UserI>): Promise<User> {
    return user.update(data);
  }

  public async delete(user: User): Promise<void> {
    await sequelize.transaction(async (transaction) => {
      await RoleUser.destroy({ where: { user_id: user.id }, transaction });
      await RefreshToken.destroy({ where: { user_id: user.id }, transaction });
      await user.destroy({ transaction });
    });
  }
}

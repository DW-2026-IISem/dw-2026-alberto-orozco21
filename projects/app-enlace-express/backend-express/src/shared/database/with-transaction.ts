import { Transaction } from "sequelize";
import { sequelize } from "../../database/db";

export function withTransaction<T>(
  work: (transaction: Transaction) => Promise<T>
): Promise<T> {
  return sequelize.transaction(work);
}

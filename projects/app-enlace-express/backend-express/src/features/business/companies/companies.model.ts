import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface CompaniesI {
  id?: number;
  nit: string;
  razon_social: string;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Companies extends Model {
  public id!: number;
  public nit!: string;
  public razon_social!: string;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Companies.init(
  {
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    razon_social: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Companies",
    tableName: "companies",
    timestamps: true,
  }
);

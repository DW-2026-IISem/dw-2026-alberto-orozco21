import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface AddressI {
  id?: number;
  empresa_id: number;
  alias: string;
  linea1: string;
  linea2?: string | null;
  ciudad: string;
  departamento?: string | null;
  pais?: string | null;
  codigo_postal?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  tipo: "recogida" | "entrega" | "mixta";
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Address extends Model {
  public id!: number;
  public empresa_id!: number;
  public alias!: string;
  public linea1!: string;
  public linea2!: string | null;
  public ciudad!: string;
  public departamento!: string | null;
  public pais!: string | null;
  public codigo_postal!: string | null;
  public latitud!: number | null;
  public longitud!: number | null;
  public tipo!: "recogida" | "entrega" | "mixta";
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Address.init(
  {
    empresa_id: {
      type: DataTypes.INTEGER,
      references: { model: "companies", key: "id" },
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    linea1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    linea2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codigo_postal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitud: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM("recogida", "entrega", "mixta"),
      allowNull: false,
      defaultValue: "recogida",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    timestamps: true,
  }
);

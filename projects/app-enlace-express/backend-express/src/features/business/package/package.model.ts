import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface PackageI {
  id?: number;
  envio_id: number;
  descripcion_contenido?: string | null;
  peso_kg: number;
  alto_cm?: number | null;
  ancho_cm?: number | null;
  largo_cm?: number | null;
  valor_declarado?: number | null;
  es_fragil?: boolean;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Package extends Model<PackageI> implements PackageI {
  public id!: number;
  public envio_id!: number;
  public descripcion_contenido!: string | null;
  public peso_kg!: number;
  public alto_cm!: number | null;
  public ancho_cm!: number | null;
  public largo_cm!: number | null;
  public valor_declarado!: number | null;
  public es_fragil!: boolean;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Package.init(
  {
    envio_id: {
      type: DataTypes.INTEGER,
      references: { model: "shipments", key: "id" },
      allowNull: false,
    },
    descripcion_contenido: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    peso_kg: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    alto_cm: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    ancho_cm: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    largo_cm: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    valor_declarado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    es_fragil: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Package",
    tableName: "packages",
    timestamps: true,
  }
);

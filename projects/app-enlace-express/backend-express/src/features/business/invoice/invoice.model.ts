import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type InvoiceStatus = "pendiente" | "pagada" | "vencida" | "anulada";

export interface InvoiceI {
  id?: number;
  numero: string;
  empresa_id: number;
  periodo_desde: string;
  periodo_hasta: string;
  fecha: string;
  subtotal: number;
  impuestos?: number | null;
  total: number;
  estado: InvoiceStatus;
  fecha_pago?: Date | string | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Invoice extends Model<InvoiceI> implements InvoiceI {
  public id!: number;
  public numero!: string;
  public empresa_id!: number;
  public periodo_desde!: string;
  public periodo_hasta!: string;
  public fecha!: string;
  public subtotal!: number;
  public impuestos!: number | null;
  public total!: number;
  public estado!: InvoiceStatus;
  public fecha_pago!: Date | string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init(
  {
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      references: { model: "companies", key: "id" },
      allowNull: false,
    },
    periodo_desde: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    periodo_hasta: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    impuestos: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "pagada", "vencida", "anulada"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Invoice",
    tableName: "invoices",
    timestamps: true,
  }
);

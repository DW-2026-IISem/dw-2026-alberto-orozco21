import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type ShipmentPriority = "normal" | "urgente" | "express";
export type ShipmentStatus =
  | "creado"
  | "cotizado"
  | "asignado"
  | "en_ruta"
  | "entregado"
  | "con_novedad"
  | "cancelado";

export interface ShipmentI {
  id?: number;
  numero_guia: string;
  empresa_id: number;
  contacto_origen_id: number;
  direccion_origen_id: number;
  contacto_destino_id: number;
  direccion_destino_id: number;
  mensajero_id?: number | null;
  ruta_id?: number | null;
  tarifa_id: number;
  factura_id?: number | null;
  prioridad: ShipmentPriority;
  peso_total_kg: number;
  valor_declarado?: number | null;
  costo_calculado?: number | null;
  estado: ShipmentStatus;
  fecha_solicitud: Date | string;
  fecha_entrega_estimada?: Date | string | null;
  fecha_entrega_real?: Date | string | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Shipment extends Model<ShipmentI> implements ShipmentI {
  public id!: number;
  public numero_guia!: string;
  public empresa_id!: number;
  public contacto_origen_id!: number;
  public direccion_origen_id!: number;
  public contacto_destino_id!: number;
  public direccion_destino_id!: number;
  public mensajero_id!: number | null;
  public ruta_id!: number | null;
  public tarifa_id!: number;
  public factura_id!: number | null;
  public prioridad!: ShipmentPriority;
  public peso_total_kg!: number;
  public valor_declarado!: number | null;
  public costo_calculado!: number | null;
  public estado!: ShipmentStatus;
  public fecha_solicitud!: Date | string;
  public fecha_entrega_estimada!: Date | string | null;
  public fecha_entrega_real!: Date | string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Shipment.init(
  {
    numero_guia: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      references: { model: "companies", key: "id" },
      allowNull: false,
    },
    contacto_origen_id: {
      type: DataTypes.INTEGER,
      references: { model: "contacts", key: "id" },
      allowNull: false,
    },
    direccion_origen_id: {
      type: DataTypes.INTEGER,
      references: { model: "addresses", key: "id" },
      allowNull: false,
    },
    contacto_destino_id: {
      type: DataTypes.INTEGER,
      references: { model: "contacts", key: "id" },
      allowNull: false,
    },
    direccion_destino_id: {
      type: DataTypes.INTEGER,
      references: { model: "addresses", key: "id" },
      allowNull: false,
    },
    mensajero_id: {
      type: DataTypes.INTEGER,
      references: { model: "messengers", key: "id" },
      allowNull: true,
    },
    ruta_id: {
      type: DataTypes.INTEGER,
      references: { model: "routes", key: "id" },
      allowNull: true,
    },
    tarifa_id: {
      type: DataTypes.INTEGER,
      references: { model: "rates", key: "id" },
      allowNull: false,
    },
    factura_id: {
      type: DataTypes.INTEGER,
      references: { model: "invoices", key: "id" },
      allowNull: true,
    },
    prioridad: {
      type: DataTypes.ENUM("normal", "urgente", "express"),
      allowNull: false,
      defaultValue: "normal",
    },
    peso_total_kg: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    valor_declarado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    costo_calculado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM(
        "creado",
        "cotizado",
        "asignado",
        "en_ruta",
        "entregado",
        "con_novedad",
        "cancelado"
      ),
      allowNull: false,
      defaultValue: "creado",
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_entrega_estimada: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_entrega_real: {
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
    modelName: "Shipment",
    tableName: "shipments",
    timestamps: true,
  }
);

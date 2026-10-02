import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type TrackingEventType =
  | "recogido"
  | "en_transito"
  | "en_reparto"
  | "novedad"
  | "entregado"
  | "devuelto";
export type TrackingEventStatus = "informativo" | "novedad_leve" | "novedad_critica";

export interface TrackingEventI {
  id?: number;
  envio_id: number;
  tipo: TrackingEventType;
  fecha: Date | string;
  ubicacion?: string | null;
  observaciones?: string | null;
  estado: TrackingEventStatus;
  registrado_por_id?: number | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TrackingEvent extends Model<TrackingEventI> implements TrackingEventI {
  public id!: number;
  public envio_id!: number;
  public tipo!: TrackingEventType;
  public fecha!: Date | string;
  public ubicacion!: string | null;
  public observaciones!: string | null;
  public estado!: TrackingEventStatus;
  public registrado_por_id!: number | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TrackingEvent.init(
  {
    envio_id: {
      type: DataTypes.INTEGER,
      references: { model: "shipments", key: "id" },
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("recogido", "en_transito", "en_reparto", "novedad", "entregado", "devuelto"),
      allowNull: false,
      defaultValue: "recogido",
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("informativo", "novedad_leve", "novedad_critica"),
      allowNull: false,
      defaultValue: "informativo",
    },
    registrado_por_id: {
      type: DataTypes.INTEGER,
      references: { model: "messengers", key: "id" },
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
    modelName: "TrackingEvent",
    tableName: "tracking_events",
    timestamps: true,
  }
);

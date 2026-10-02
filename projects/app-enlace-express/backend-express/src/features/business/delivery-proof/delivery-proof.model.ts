import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type DeliveryProofStatus = "valida" | "observada" | "rechazada";

export interface DeliveryProofI {
  id?: number;
  envio_id: number;
  fecha_hora: Date | string;
  receptor_nombre: string;
  receptor_documento?: string | null;
  firma_url?: string | null;
  foto_url?: string | null;
  geolocalizacion_lat?: number | null;
  geolocalizacion_lng?: number | null;
  observaciones?: string | null;
  estado: DeliveryProofStatus;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DeliveryProof extends Model<DeliveryProofI> implements DeliveryProofI {
  public id!: number;
  public envio_id!: number;
  public fecha_hora!: Date | string;
  public receptor_nombre!: string;
  public receptor_documento!: string | null;
  public firma_url!: string | null;
  public foto_url!: string | null;
  public geolocalizacion_lat!: number | null;
  public geolocalizacion_lng!: number | null;
  public observaciones!: string | null;
  public estado!: DeliveryProofStatus;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DeliveryProof.init(
  {
    envio_id: {
      type: DataTypes.INTEGER,
      references: { model: "shipments", key: "id" },
      allowNull: false,
      unique: true,
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    receptor_nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receptor_documento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firma_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    foto_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    geolocalizacion_lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    geolocalizacion_lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("valida", "observada", "rechazada"),
      allowNull: false,
      defaultValue: "valida",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "DeliveryProof",
    tableName: "delivery_proofs",
    timestamps: true,
  }
);

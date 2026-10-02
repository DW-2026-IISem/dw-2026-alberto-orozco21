import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type VehicleType = "moto" | "carro" | "bicicleta" | "a_pie";

export interface MessengerI {
  id?: number;
  nombre: string;
  documento_identidad: string;
  telefono?: string | null;
  tipo_vehiculo: VehicleType;
  placa_vehiculo?: string | null;
  zona_asignada?: string | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Messenger extends Model<MessengerI> implements MessengerI {
  public id!: number;
  public nombre!: string;
  public documento_identidad!: string;
  public telefono!: string | null;
  public tipo_vehiculo!: VehicleType;
  public placa_vehiculo!: string | null;
  public zona_asignada!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Messenger.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documento_identidad: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipo_vehiculo: {
      type: DataTypes.ENUM("moto", "carro", "bicicleta", "a_pie"),
      allowNull: false,
      defaultValue: "moto",
    },
    placa_vehiculo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zona_asignada: {
      type: DataTypes.STRING,
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
    modelName: "Messenger",
    tableName: "messengers",
    timestamps: true,
  }
);

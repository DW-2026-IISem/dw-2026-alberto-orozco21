import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type RouteStatus = "planificada" | "en_curso" | "finalizada";

export interface RouteI {
  id?: number;
  nombre: string;
  mensajero_id: number;
  zona_cobertura?: string | null;
  fecha: string;
  hora_inicio?: Date | string | null;
  hora_fin?: Date | string | null;
  estado: RouteStatus;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Route extends Model<RouteI> implements RouteI {
  public id!: number;
  public nombre!: string;
  public mensajero_id!: number;
  public zona_cobertura!: string | null;
  public fecha!: string;
  public hora_inicio!: Date | string | null;
  public hora_fin!: Date | string | null;
  public estado!: RouteStatus;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Route.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mensajero_id: {
      type: DataTypes.INTEGER,
      references: { model: "messengers", key: "id" },
      allowNull: false,
    },
    zona_cobertura: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    hora_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("planificada", "en_curso", "finalizada"),
      allowNull: false,
      defaultValue: "planificada",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Route",
    tableName: "routes",
    timestamps: true,
  }
);

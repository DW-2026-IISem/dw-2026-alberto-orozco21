import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type CalculationRule = "por_peso" | "por_zona" | "plana";

export interface RateI {
  id?: number;
  nombre: string;
  zona: string;
  regla_calculo: CalculationRule;
  valor_base: number;
  valor_por_kg_adicional?: number | null;
  recargo_urgente_pct?: number | null;
  vigencia_desde: string;
  vigencia_hasta?: string | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Rate extends Model<RateI> implements RateI {
  public id!: number;
  public nombre!: string;
  public zona!: string;
  public regla_calculo!: CalculationRule;
  public valor_base!: number;
  public valor_por_kg_adicional!: number | null;
  public recargo_urgente_pct!: number | null;
  public vigencia_desde!: string;
  public vigencia_hasta!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Rate.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zona: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regla_calculo: {
      type: DataTypes.ENUM("por_peso", "por_zona", "plana"),
      allowNull: false,
      defaultValue: "por_peso",
    },
    valor_base: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    valor_por_kg_adicional: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    recargo_urgente_pct: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    vigencia_desde: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    vigencia_hasta: {
      type: DataTypes.DATEONLY,
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
    modelName: "Rate",
    tableName: "rates",
    timestamps: true,
  }
);

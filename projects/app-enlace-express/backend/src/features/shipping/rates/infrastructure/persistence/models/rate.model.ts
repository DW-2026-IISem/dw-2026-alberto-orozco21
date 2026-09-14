import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { RateCalculationRule } from '../../../domain/enums/rate-calculation-rule.enum.js';
import { ShipmentModel } from '../../../../shipments/infrastructure/persistence/models/shipment.model.js';

@Table({ tableName: 'rates' })
export class RateModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare zone: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(RateCalculationRule)),
    allowNull: false,
  })
  declare calculationRule: RateCalculationRule;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare baseValue: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare additionalValuePerKg: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, defaultValue: 0 })
  declare urgentSurchargePct: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare validFrom: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare validUntil: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

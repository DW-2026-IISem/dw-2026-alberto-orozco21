import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ShipmentModel } from '../../../../shipments/infrastructure/persistence/models/shipment.model.js';

@Table({ tableName: 'packages' })
export class PackageModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => ShipmentModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare shipmentId: number;

  @BelongsTo(() => ShipmentModel)
  declare shipment: ShipmentModel;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare contentDescription: string;

  @Column({ type: DataType.DECIMAL(8, 2), allowNull: false })
  declare weightKg: number;

  @Column({ type: DataType.DECIMAL(8, 2), allowNull: false })
  declare heightCm: number;

  @Column({ type: DataType.DECIMAL(8, 2), allowNull: false })
  declare widthCm: number;

  @Column({ type: DataType.DECIMAL(8, 2), allowNull: false })
  declare lengthCm: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  declare declaredValue: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare isFragile: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

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
import { ProofOfDeliveryStatus } from '../../../domain/enums/proof-of-delivery-status.enum.js';

@Table({ tableName: 'delivery_proofs' })
export class ProofOfDeliveryModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => ShipmentModel)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  declare shipmentId: number;

  @BelongsTo(() => ShipmentModel)
  declare shipment: Model;

  @Column({ type: DataType.DATE, allowNull: false })
  declare deliveredAt: Date;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare receiverName: string;

  @Column({ type: DataType.STRING(30), allowNull: false })
  declare receiverDocument: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  declare signatureUrl: string | null;

  @Column({ type: DataType.STRING(500), allowNull: true })
  declare photoUrl: string | null;

  @Column({ type: DataType.DECIMAL(10, 7), allowNull: true })
  declare latitude: number | null;

  @Column({ type: DataType.DECIMAL(10, 7), allowNull: true })
  declare longitude: number | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare observations: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(ProofOfDeliveryStatus)),
    allowNull: false,
    defaultValue: ProofOfDeliveryStatus.VALID,
  })
  declare status: ProofOfDeliveryStatus;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

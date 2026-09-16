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
import { CourierModel } from '../../../../couriers/infrastructure/persistence/models/courier.model.js';
import { TrackingEventType } from '../../../domain/enums/tracking-event-type.enum.js';
import { TrackingEventSeverity } from '../../../domain/enums/tracking-event-severity.enum.js';

@Table({ tableName: 'tracking_events', updatedAt: false })
export class TrackingEventModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => ShipmentModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare shipmentId: number;

  @BelongsTo(() => ShipmentModel)
  declare shipment: Model;

  @Column({
    type: DataType.ENUM(...Object.values(TrackingEventType)),
    allowNull: false,
  })
  declare type: TrackingEventType;

  @Column({ type: DataType.DATE, allowNull: false })
  declare eventDate: Date;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare location: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare observations: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(TrackingEventSeverity)),
    allowNull: false,
    defaultValue: TrackingEventSeverity.INFO,
  })
  declare severity: TrackingEventSeverity;

  @ForeignKey(() => CourierModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare recordedByCourierId: number | null;

  @BelongsTo(() => CourierModel)
  declare recordedByCourier: Model;

  @CreatedAt
  declare createdAt: Date;
}

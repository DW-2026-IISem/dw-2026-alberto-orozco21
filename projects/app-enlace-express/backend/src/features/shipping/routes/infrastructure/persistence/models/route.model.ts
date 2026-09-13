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
import { CourierModel } from '../../../../couriers/infrastructure/persistence/models/courier.model.js';
import { RouteStatus } from '../../../domain/enums/route-status.enum.js';

@Table({ tableName: 'routes' })
export class RouteModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => CourierModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare courierId: number;

  @BelongsTo(() => CourierModel)
  declare courier: CourierModel;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare coverageZone: string | null;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare startTime: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare endTime: Date | null;

  @Column({
    type: DataType.ENUM(...Object.values(RouteStatus)),
    allowNull: false,
    defaultValue: RouteStatus.PLANNED,
  })
  declare status: RouteStatus;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

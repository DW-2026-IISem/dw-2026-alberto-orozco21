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
import { VehicleType } from '../../../domain/enums/vehicle-type.enum.js';
import { RouteModel } from '../../../../routes/infrastructure/persistence/models/route.model.js';

@Table({ tableName: 'couriers' })
export class CourierModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  declare documentId: string;

  @Column({ type: DataType.STRING(30), allowNull: true })
  declare phone: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(VehicleType)),
    allowNull: false,
  })
  declare vehicleType: VehicleType;

  @Column({ type: DataType.STRING(15), allowNull: true })
  declare licensePlate: string | null;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare assignedZone: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

}

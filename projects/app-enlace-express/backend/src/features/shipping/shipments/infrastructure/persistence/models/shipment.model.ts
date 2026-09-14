import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CompanyModel } from '../../../../companies/infrastructure/persistence/models/company.model.js';
import { ContactModel } from '../../../../contacts/infrastructure/persistence/models/contact.model.js';
import { AddressModel } from '../../../../addresses/infrastructure/persistence/models/address.model.js';
import { RateModel } from '../../../../rates/infrastructure/persistence/models/rate.model.js';
import { CourierModel } from '../../../../couriers/infrastructure/persistence/models/courier.model.js';
import { RouteModel } from '../../../../routes/infrastructure/persistence/models/route.model.js';
import { InvoiceModel } from '../../../../invoices/infrastructure/persistence/models/invoice.model.js';
import { PackageModel } from '../../../../packages/infrastructure/persistence/models/package.model.js';
import { ShipmentPriority } from '../../../domain/enums/shipment-priority.enum.js';
import { ShipmentStatus } from '../../../domain/enums/shipment-status.enum.js';

@Table({ tableName: 'shipments' })
export class ShipmentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  declare guideNumber: string;

  @ForeignKey(() => CompanyModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare companyId: number;

  @BelongsTo(() => CompanyModel)
  declare company: CompanyModel;

  @ForeignKey(() => ContactModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare originContactId: number;

  @BelongsTo(() => ContactModel, { foreignKey: 'originContactId', as: 'originContact' })
  declare originContact: ContactModel;

  @ForeignKey(() => AddressModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare originAddressId: number;

  @BelongsTo(() => AddressModel, { foreignKey: 'originAddressId', as: 'originAddress' })
  declare originAddress: AddressModel;

  @ForeignKey(() => ContactModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare destinationContactId: number;

  @BelongsTo(() => ContactModel, {
    foreignKey: 'destinationContactId',
    as: 'destinationContact',
  })
  declare destinationContact: ContactModel;

  @ForeignKey(() => AddressModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare destinationAddressId: number;

  @BelongsTo(() => AddressModel, {
    foreignKey: 'destinationAddressId',
    as: 'destinationAddress',
  })
  declare destinationAddress: AddressModel;

  @ForeignKey(() => RateModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare rateId: number;

  @BelongsTo(() => RateModel)
  declare rate: RateModel;

  @ForeignKey(() => CourierModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare courierId: number | null;

  @BelongsTo(() => CourierModel)
  declare courier: CourierModel;

  @ForeignKey(() => RouteModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare routeId: number | null;

  @BelongsTo(() => RouteModel)
  declare route: RouteModel;

  @ForeignKey(() => InvoiceModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare invoiceId: number | null;

  @BelongsTo(() => InvoiceModel)
  declare invoice: InvoiceModel;

  @Column({
    type: DataType.ENUM(...Object.values(ShipmentPriority)),
    allowNull: false,
    defaultValue: ShipmentPriority.NORMAL,
  })
  declare priority: ShipmentPriority;

  @Column({ type: DataType.DECIMAL(8, 2), allowNull: false })
  declare totalWeightKg: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  declare declaredValue: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  declare calculatedCost: number | null;

  @Column({
    type: DataType.ENUM(...Object.values(ShipmentStatus)),
    allowNull: false,
    defaultValue: ShipmentStatus.CREATED,
  })
  declare status: ShipmentStatus;

  @Column({ type: DataType.DATE, allowNull: false })
  declare requestDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  declare estimatedDeliveryDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare actualDeliveryDate: Date | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

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
import { ShipmentModel } from '../../../../shipments/infrastructure/persistence/models/shipment.model.js';
import { InvoiceStatus } from '../../../domain/enums/invoice-status.enum.js';

@Table({ tableName: 'invoices' })
export class InvoiceModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => CompanyModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare companyId: number;

  @BelongsTo(() => CompanyModel)
  declare company: CompanyModel;

  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  declare number: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare periodStart: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare periodEnd: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare issueDate: string;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  declare taxes: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  declare total: number;

  @Column({
    type: DataType.ENUM(...Object.values(InvoiceStatus)),
    allowNull: false,
    defaultValue: InvoiceStatus.PENDING,
  })
  declare status: InvoiceStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  declare paymentDate: Date | null;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

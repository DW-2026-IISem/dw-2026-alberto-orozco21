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
import { CompanyModel } from '../../../../companies/infrastructure/persistence/models/company.model.js';
import { AddressType } from '../../../domain/enums/address-type.enum.js';

@Table({ tableName: 'addresses' })
export class AddressModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => CompanyModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare companyId: number;

  @BelongsTo(() => CompanyModel)
  declare company: CompanyModel;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare alias: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare addressLine1: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare addressLine2: string | null;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare city: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare state: string | null;

  @Column({ type: DataType.STRING(100), allowNull: false, defaultValue: 'Colombia' })
  declare country: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare postalCode: string | null;

  @Column({ type: DataType.DECIMAL(10, 7), allowNull: true })
  declare latitude: number | null;

  @Column({ type: DataType.DECIMAL(10, 7), allowNull: true })
  declare longitude: number | null;

  @Column({
    type: DataType.ENUM(...Object.values(AddressType)),
    allowNull: false,
    defaultValue: AddressType.MIXED,
  })
  declare type: AddressType;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

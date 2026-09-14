import { Inject, Injectable } from '@nestjs/common';
import { ShipmentStatus } from '../../../shipments/domain/enums/shipment-status.enum.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../../shipments/domain/interfaces/shipment-repository.interface.js';
import { PackageNotFoundException } from '../../domain/exceptions/package-not-found.exception.js';
import {
  PACKAGE_REPOSITORY,
  type IPackageRepository,
} from '../../domain/interfaces/package-repository.interface.js';

@Injectable()
export class DeletePackageUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const pkg = await this.packageRepository.findById(id);

    const shipment = await this.shipmentRepository.findById(pkg.shipmentId);
    if (shipment && shipment.status !== ShipmentStatus.CREATED) {
      throw new Error(
        

import { Inject, Injectable } from '@nestjs/common';
import { ShipmentStatus } from '../../../shipments/domain/enums/shipment-status.enum.js';
import { ShipmentNotFoundException } from '../../../shipments/domain/exceptions/shipment-not-found.exception.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../../shipments/domain/interfaces/shipment-repository.interface.js';
import { Package } from '../../domain/entities/package.entity.js';
import {
  PACKAGE_REPOSITORY,
  type IPackageRepository,
} from '../../domain/interfaces/package-repository.interface.js';
import { CreatePackageDto } from '../dto/create-package.dto.js';
import { PackageMapper } from '../mappers/package.mapper.js';

@Injectable()
export class CreatePackageUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
  ) {}

  async execute(dto: CreatePackageDto) {
    const shipment = await this.shipmentRepository.findById(dto.shipmentId);
    if (!shipment) throw new ShipmentNotFoundException(dto.shipmentId);

    if (shipment.status !== ShipmentStatus.CREATED) {
      throw new Error(
        `No se pueden agregar paquetes a un envío en estado '${shipment.status}'`,
      );
    }

    const pkg = Package.create({
      shipmentId: dto.shipmentId,
      contentDescription: dto.contentDescription,
      weightKg: dto.weightKg,
      heightCm: dto.heightCm,
      widthCm: dto.widthCm,
      lengthCm: dto.lengthCm,
      declaredValue: dto.declaredValue,
      isFragile: dto.isFragile,
    });

    const created = await this.packageRepository.create(pkg);
    return PackageMapper.toResponse(created);
  }
}

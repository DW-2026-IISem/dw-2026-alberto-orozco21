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
import { UpdatePackageDto } from '../dto/update-package.dto.js';
import { PackageMapper } from '../mappers/package.mapper.js';

@Injectable()
export class UpdatePackageUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
  ) {}

  async execute(id: number, dto: UpdatePackageDto) {
    const pkg = await this.packageRepository.findById(id);
    if (!pkg) throw new PackageNotFoundException(id);

    const shipment = await this.shipmentRepository.findById(pkg.shipmentId);
    if (shipment && shipment.status !== ShipmentStatus.CREATED) {
      throw new Error(
        `No se pueden modificar paquetes de un envío en estado '${shipment.status}'`,
      );
    }

    pkg.update(dto);

    const updated = await this.packageRepository.update(pkg);
    return PackageMapper.toResponse(updated);
  }
}

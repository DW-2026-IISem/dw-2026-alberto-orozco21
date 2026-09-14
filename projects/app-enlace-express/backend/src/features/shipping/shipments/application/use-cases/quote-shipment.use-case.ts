import { Inject, Injectable } from '@nestjs/common';
import { RateCalculationRule } from '../../../rates/domain/enums/rate-calculation-rule.enum.js';
import { RateNotFoundException } from '../../../rates/domain/exceptions/rate-not-found.exception.js';
import {
  RATE_REPOSITORY,
  type IRateRepository,
} from '../../../rates/domain/interfaces/rate-repository.interface.js';
import { ShipmentPriority } from '../../domain/enums/shipment-priority.enum.js';
import { ShipmentNotFoundException } from '../../domain/exceptions/shipment-not-found.exception.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../domain/interfaces/shipment-repository.interface.js';
import { ShipmentMapper } from '../mappers/shipment.mapper.js';

@Injectable()
export class QuoteShipmentUseCase {
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
    @Inject(RATE_REPOSITORY)
    private readonly rateRepository: IRateRepository,
  ) {}

  async execute(id: number) {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) throw new ShipmentNotFoundException(id);

    const rate = await this.rateRepository.findById(shipment.rateId);
    if (!rate) throw new RateNotFoundException(shipment.rateId);

    let cost =
      rate.calculationRule === RateCalculationRule.FLAT
        ? rate.baseValue
        : rate.baseValue + shipment.totalWeightKg * rate.additionalValuePerKg;

    if (
      shipment.priority === ShipmentPriority.URGENT ||
      shipment.priority === ShipmentPriority.EXPRESS
    ) {
      cost += cost * (rate.urgentSurchargePct / 100);
    }

    shipment.quote(Number(cost.toFixed(2)));

    const updated = await this.shipmentRepository.update(shipment);
    return ShipmentMapper.toResponse(updated);
  }
}

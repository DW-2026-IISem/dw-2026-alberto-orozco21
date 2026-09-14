import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { ShipmentPriority } from '../enums/shipment-priority.enum.js';
import { ShipmentStatus } from '../enums/shipment-status.enum.js';
import { Shipment } from '../entities/shipment.entity.js';

export const SHIPMENT_REPOSITORY = 'SHIPMENT_REPOSITORY';

export interface ShipmentFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: number;
  courierId?: number;
  status?: ShipmentStatus;
  priority?: ShipmentPriority;
}

export interface IShipmentRepository {
  create(shipment: Shipment): Promise<Shipment>;
  update(shipment: Shipment): Promise<Shipment>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Shipment | null>;
  findAll(params: ShipmentFindAllParams): Promise<PaginatedResult<Shipment>>;
}

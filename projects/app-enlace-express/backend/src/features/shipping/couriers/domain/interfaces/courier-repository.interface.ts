import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { VehicleType } from '../enums/vehicle-type.enum.js';
import { Courier } from '../entities/courier.entity.js';

export const COURIER_REPOSITORY = 'COURIER_REPOSITORY';

export interface CourierFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  vehicleType?: VehicleType;
  assignedZone?: string;
  includeInactive?: boolean;
}

export interface ICourierRepository {
  create(courier: Courier): Promise<Courier>;
  update(courier: Courier): Promise<Courier>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Courier | null>;
  findByDocumentId(documentId: string): Promise<Courier | null>;
  findAll(params: CourierFindAllParams): Promise<PaginatedResult<Courier>>;
}

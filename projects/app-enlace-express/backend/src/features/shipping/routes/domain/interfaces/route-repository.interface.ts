import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { RouteStatus } from '../enums/route-status.enum.js';
import { Route } from '../entities/route.entity.js';

export const ROUTE_REPOSITORY = 'ROUTE_REPOSITORY';

export interface RouteFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  courierId?: number;
  status?: RouteStatus;
  includeInactive?: boolean;
}

export interface IRouteRepository {
  create(route: Route): Promise<Route>;
  update(route: Route): Promise<Route>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Route | null>;
  findAll(params: RouteFindAllParams): Promise<PaginatedResult<Route>>;
}

import { Route } from '../../../domain/entities/route.entity.js';
import { RouteResponseDto } from '../../../application/dto/route-response.dto.js';
import { RouteMapper } from '../../../application/mappers/route.mapper.js';

export class RouteSerializer {
  static serialize(entity: Route): RouteResponseDto {
    return RouteMapper.toResponse(entity);
  }
}

import { Injectable } from '@nestjs/common';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { TrackingEvent } from '../../../domain/entities/tracking-event.entity.js';
import {
  TrackingEventFindAllParams,
  ITrackingEventRepository,
} from '../../../domain/interfaces/tracking-event-repository.interface.js';
import { TrackingEventMapper } from '../../../application/mappers/tracking-event.mapper.js';
import { TrackingEventModel } from '../models/tracking-event.model.js';

@Injectable()
export class TrackingEventRepository implements ITrackingEventRepository {
  async create(event: TrackingEvent): Promise<TrackingEvent> {
    const model = await TrackingEventModel.create(
      TrackingEventMapper.toPersistence(event),
    );
    return TrackingEventMapper.toDomain(model);
  }

  async findById(id: number): Promise<TrackingEvent | null> {
    const model = await TrackingEventModel.findByPk(id);
    return model ? TrackingEventMapper.toDomain(model) : null;
  }

  async findAll(params: TrackingEventFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};
    if (params.shipmentId) where.shipmentId = params.shipmentId;
    if (params.type) where.type = params.type;

    const { rows, count } = await TrackingEventModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['eventDate', 'ASC']],
    });

    return buildPaginatedResult(
      rows.map((row) => TrackingEventMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}

import { RouteStatus } from '../enums/route-status.enum.js';

export interface RouteProps {
  id?: number;
  courierId: number;
  name: string;
  coverageZone?: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  status?: RouteStatus;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Route {
  id?: number;
  courierId: number;
  name: string;
  coverageZone?: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  status: RouteStatus;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: RouteProps) {
    this.id = props.id;
    this.courierId = props.courierId;
    this.name = props.name;
    this.coverageZone = props.coverageZone;
    this.date = props.date;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.status = props.status ?? RouteStatus.PLANNED;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private static validateTimes(startTime: Date, endTime?: Date): void {
    if (endTime && endTime <= startTime) {
      throw new Error('La hora de fin debe ser posterior a la hora de inicio');
    }
  }

  static create(
    props: Omit<RouteProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Route {
    if (!props.courierId) {
      throw new Error('La ruta debe estar asignada a un mensajero');
    }

    if (!props.name?.trim()) {
      throw new Error('El nombre de la ruta es requerido');
    }

    if (!props.date) {
      throw new Error('La fecha de la ruta es requerida');
    }

    if (!props.startTime) {
      throw new Error('La hora de inicio es requerida');
    }

    Route.validateTimes(props.startTime, props.endTime);

    return new Route(props);
  }

  static reconstitute(props: RouteProps): Route {
    return new Route(props);
  }

  update(
    props: Partial<
      Omit<RouteProps, 'id' | 'courierId' | 'isActive' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    const nextStartTime = props.startTime ?? this.startTime;
    const nextEndTime = props.endTime !== undefined ? props.endTime : this.endTime;

    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la ruta es requerida');
      }
      this.name = props.name;
    }

    if (props.coverageZone !== undefined) {
      this.coverageZone = props.coverageZone;
    }

    if (props.date !== undefined) {
      this.date = props.date;
    }

    if (props.startTime !== undefined || props.endTime !== undefined) {
      Route.validateTimes(nextStartTime, nextEndTime);
      this.startTime = nextStartTime;
      this.endTime = nextEndTime;
    }

    if (props.status !== undefined) {
      this.status = props.status;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}

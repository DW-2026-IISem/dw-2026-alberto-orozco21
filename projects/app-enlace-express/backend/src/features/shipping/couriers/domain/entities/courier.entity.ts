import { VehicleType } from '../enums/vehicle-type.enum.js';
import { isValidCourierPhone } from '../validators/courier-phone.validator.js';

const PLATE_REQUIRED_TYPES = [VehicleType.MOTORCYCLE, VehicleType.CAR];

export interface CourierProps {
  id?: number;
  name: string;
  documentId: string;
  phone?: string;
  vehicleType: VehicleType;
  licensePlate?: string;
  assignedZone?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Courier {
  id?: number;
  name: string;
  documentId: string;
  phone?: string;
  vehicleType: VehicleType;
  licensePlate?: string;
  assignedZone?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: CourierProps) {
    this.id = props.id;
    this.name = props.name;
    this.documentId = props.documentId;
    this.phone = props.phone;
    this.vehicleType = props.vehicleType;
    this.licensePlate = props.licensePlate;
    this.assignedZone = props.assignedZone;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private static validatePlate(
    vehicleType: VehicleType,
    licensePlate?: string,
  ): void {
    const requiresPlate = PLATE_REQUIRED_TYPES.includes(vehicleType);

    if (requiresPlate && !licensePlate?.trim()) {
      throw new Error(
        `La placa es requerida para vehículos de tipo '${vehicleType}'`,
      );
    }

    if (!requiresPlate && licensePlate?.trim()) {
      throw new Error(
        `Los vehículos de tipo '${vehicleType}' no deben tener placa`,
      );
    }
  }

  static create(
    props: Omit<CourierProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Courier {
    if (!props.name?.trim()) {
      throw new Error('El nombre del mensajero es requerido');
    }

    if (!props.documentId?.trim()) {
      throw new Error('El documento de identidad es requerido');
    }

    if (props.phone && !isValidCourierPhone(props.phone)) {
      throw new Error('El teléfono del mensajero no es válido');
    }

    Courier.validatePlate(props.vehicleType, props.licensePlate);

    return new Courier(props);
  }

  static reconstitute(props: CourierProps): Courier {
    return new Courier(props);
  }

  update(
    props: Partial<
      Omit<CourierProps, 'id' | 'documentId' | 'isActive' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    const nextVehicleType = props.vehicleType ?? this.vehicleType;
    const nextPlate =
      props.licensePlate !== undefined ? props.licensePlate : this.licensePlate;

    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del mensajero es requerido');
      }
      this.name = props.name;
    }

    if (props.phone !== undefined) {
      if (props.phone && !isValidCourierPhone(props.phone)) {
        throw new Error('El teléfono del mensajero no es válido');
      }
      this.phone = props.phone;
    }

    if (props.vehicleType !== undefined || props.licensePlate !== undefined) {
      Courier.validatePlate(nextVehicleType, nextPlate);
      this.vehicleType = nextVehicleType;
      this.licensePlate = nextPlate;
    }

    if (props.assignedZone !== undefined) {
      this.assignedZone = props.assignedZone;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}

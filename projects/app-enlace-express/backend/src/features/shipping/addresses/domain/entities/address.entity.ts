import { AddressType } from '../enums/address-type.enum.js';
import {
  isValidLatitude,
  isValidLongitude,
} from '../validators/address-coordinates.validator.js';

export interface AddressProps {
  id?: number;
  companyId: number;
  alias: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  type?: AddressType;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Address {
  id?: number;
  companyId: number;
  alias: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  type: AddressType;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: AddressProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.alias = props.alias;
    this.addressLine1 = props.addressLine1;
    this.addressLine2 = props.addressLine2;
    this.city = props.city;
    this.state = props.state;
    this.country = props.country ?? 'Colombia';
    this.postalCode = props.postalCode;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.type = props.type ?? AddressType.MIXED;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private static validateCoordinates(
    latitude?: number,
    longitude?: number,
  ): void {
    if (latitude !== undefined && !isValidLatitude(latitude)) {
      throw new Error('La latitud debe estar entre -90 y 90');
    }
    if (longitude !== undefined && !isValidLongitude(longitude)) {
      throw new Error('La longitud debe estar entre -180 y 180');
    }
  }

  static create(
    props: Omit<AddressProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Address {
    if (!props.companyId) {
      throw new Error('La dirección debe pertenecer a una empresa');
    }

    if (!props.alias?.trim()) {
      throw new Error('El alias de la dirección es requerido');
    }

    if (!props.addressLine1?.trim()) {
      throw new Error('La línea de dirección es requerida');
    }

    if (!props.city?.trim()) {
      throw new Error('La ciudad es requerida');
    }

    Address.validateCoordinates(props.latitude, props.longitude);

    return new Address(props);
  }

  static reconstitute(props: AddressProps): Address {
    return new Address(props);
  }

  update(
    props: Partial<
      Omit<AddressProps, 'id' | 'companyId' | 'isActive' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    if (props.alias !== undefined) {
      if (!props.alias.trim()) {
        throw new Error('El alias de la dirección es requerido');
      }
      this.alias = props.alias;
    }

    if (props.addressLine1 !== undefined) {
      if (!props.addressLine1.trim()) {
        throw new Error('La línea de dirección es requerida');
      }
      this.addressLine1 = props.addressLine1;
    }

    if (props.addressLine2 !== undefined) {
      this.addressLine2 = props.addressLine2;
    }

    if (props.city !== undefined) {
      if (!props.city.trim()) {
        throw new Error('La ciudad es requerida');
      }
      this.city = props.city;
    }

    if (props.state !== undefined) {
      this.state = props.state;
    }

    if (props.country !== undefined) {
      this.country = props.country;
    }

    if (props.postalCode !== undefined) {
      this.postalCode = props.postalCode;
    }

    if (props.latitude !== undefined || props.longitude !== undefined) {
      const nextLatitude = props.latitude ?? this.latitude;
      const nextLongitude = props.longitude ?? this.longitude;
      Address.validateCoordinates(nextLatitude, nextLongitude);
      if (props.latitude !== undefined) this.latitude = props.latitude;
      if (props.longitude !== undefined) this.longitude = props.longitude;
    }

    if (props.type !== undefined) {
      this.type = props.type;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}

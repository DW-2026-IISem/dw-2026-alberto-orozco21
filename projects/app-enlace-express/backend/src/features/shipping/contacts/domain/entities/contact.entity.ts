import { isValidContactEmail } from '../validators/contact-email.validator.js';
import { isValidContactPhone } from '../validators/contact-phone.validator.js';

export interface ContactProps {
  id?: number;
  companyId: number;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Contact {
  id?: number;
  companyId: number;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ContactProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.name = props.name;
    this.position = props.position;
    this.phone = props.phone;
    this.email = props.email;
    this.isPrimary = props.isPrimary ?? false;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ContactProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Contact {
    if (!props.companyId) {
      throw new Error('El contacto debe pertenecer a una empresa');
    }

    if (!props.name?.trim()) {
      throw new Error('El nombre del contacto es requerido');
    }

    if (props.email && !isValidContactEmail(props.email)) {
      throw new Error('El email del contacto no es válido');
    }

    if (props.phone && !isValidContactPhone(props.phone)) {
      throw new Error('El teléfono del contacto no es válido');
    }

    return new Contact(props);
  }

  static reconstitute(props: ContactProps): Contact {
    return new Contact(props);
  }

  update(
    props: Partial<
      Omit<ContactProps, 'id' | 'companyId' | 'isActive' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del contacto es requerido');
      }
      this.name = props.name;
    }

    if (props.position !== undefined) {
      this.position = props.position;
    }

    if (props.phone !== undefined) {
      if (props.phone && !isValidContactPhone(props.phone)) {
        throw new Error('El teléfono del contacto no es válido');
      }
      this.phone = props.phone;
    }

    if (props.email !== undefined) {
      if (props.email && !isValidContactEmail(props.email)) {
        throw new Error('El email del contacto no es válido');
      }
      this.email = props.email;
    }

    if (props.isPrimary !== undefined) {
      this.isPrimary = props.isPrimary;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}

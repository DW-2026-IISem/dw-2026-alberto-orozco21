import { ProofOfDeliveryStatus } from '../enums/proof-of-delivery-status.enum.js';

export interface ProofOfDeliveryProps {
  id?: number;
  shipmentId: number;
  deliveredAt?: Date;
  receiverName: string;
  receiverDocument: string;
  signatureUrl?: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  observations?: string;
  status?: ProofOfDeliveryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProofOfDelivery {
  id?: number;
  shipmentId: number;
  deliveredAt: Date;
  receiverName: string;
  receiverDocument: string;
  signatureUrl?: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  observations?: string;
  status: ProofOfDeliveryStatus;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ProofOfDeliveryProps) {
    this.id = props.id;
    this.shipmentId = props.shipmentId;
    this.deliveredAt = props.deliveredAt ?? new Date();
    this.receiverName = props.receiverName;
    this.receiverDocument = props.receiverDocument;
    this.signatureUrl = props.signatureUrl;
    this.photoUrl = props.photoUrl;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.observations = props.observations;
    this.status = props.status ?? ProofOfDeliveryStatus.VALID;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ProofOfDeliveryProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): ProofOfDelivery {
    if (!props.shipmentId) {
      throw new Error('La prueba de entrega debe estar asociada a un envío');
    }
    if (!props.receiverName?.trim()) {
      throw new Error('El nombre del receptor es requerido');
    }
    if (!props.receiverDocument?.trim()) {
      throw new Error('El documento del receptor es requerido');
    }
    if (!props.signatureUrl?.trim() && !props.photoUrl?.trim()) {
      throw new Error('Se requiere al menos una evidencia: firma o foto');
    }

    return new ProofOfDelivery(props);
  }

  static reconstitute(props: ProofOfDeliveryProps): ProofOfDelivery {
    return new ProofOfDelivery(props);
  }

  markObserved(notes?: string): void {
    if (this.status !== ProofOfDeliveryStatus.VALID) {
      throw new Error(
        `Solo una prueba de entrega válida puede marcarse como observada (estado actual: '${this.status}')`,
      );
    }
    this.status = ProofOfDeliveryStatus.OBSERVED;
    if (notes) this.observations = notes;
  }

  markRejected(notes?: string): void {
    if (this.status !== ProofOfDeliveryStatus.VALID) {
      throw new Error(
        `Solo una prueba de entrega válida puede rechazarse (estado actual: '${this.status}')`,
      );
    }
    this.status = ProofOfDeliveryStatus.REJECTED;
    if (notes) this.observations = notes;
  }
}

import { ShipmentPriority } from '../enums/shipment-priority.enum.js';
import { ShipmentStatus } from '../enums/shipment-status.enum.js';
import { InvalidShipmentTransitionException } from '../exceptions/invalid-shipment-transition.exception.js';

export interface ShipmentProps {
  id?: number;
  guideNumber: string;
  companyId: number;
  originContactId: number;
  originAddressId: number;
  destinationContactId: number;
  destinationAddressId: number;
  rateId: number;
  courierId?: number;
  routeId?: number;
  invoiceId?: number;
  priority?: ShipmentPriority;
  totalWeightKg: number;
  declaredValue: number;
  calculatedCost?: number;
  status?: ShipmentStatus;
  requestDate?: Date;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Shipment {
  id?: number;
  guideNumber: string;
  companyId: number;
  originContactId: number;
  originAddressId: number;
  destinationContactId: number;
  destinationAddressId: number;
  rateId: number;
  courierId?: number;
  routeId?: number;
  invoiceId?: number;
  priority: ShipmentPriority;
  totalWeightKg: number;
  declaredValue: number;
  calculatedCost?: number;
  status: ShipmentStatus;
  requestDate: Date;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ShipmentProps) {
    this.id = props.id;
    this.guideNumber = props.guideNumber;
    this.companyId = props.companyId;
    this.originContactId = props.originContactId;
    this.originAddressId = props.originAddressId;
    this.destinationContactId = props.destinationContactId;
    this.destinationAddressId = props.destinationAddressId;
    this.rateId = props.rateId;
    this.courierId = props.courierId;
    this.routeId = props.routeId;
    this.invoiceId = props.invoiceId;
    this.priority = props.priority ?? ShipmentPriority.NORMAL;
    this.totalWeightKg = props.totalWeightKg;
    this.declaredValue = props.declaredValue;
    this.calculatedCost = props.calculatedCost;
    this.status = props.status ?? ShipmentStatus.CREATED;
    this.requestDate = props.requestDate ?? new Date();
    this.estimatedDeliveryDate = props.estimatedDeliveryDate;
    this.actualDeliveryDate = props.actualDeliveryDate;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static generateGuideNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `ENV-${timestamp}-${random}`;
  }

  private assertStatus(allowed: ShipmentStatus[], action: string): void {
    if (!allowed.includes(this.status)) {
      throw new InvalidShipmentTransitionException(this.status, action);
    }
  }

  static create(
    props: Omit<
      ShipmentProps,
      | 'id'
      | 'status'
      | 'calculatedCost'
      | 'courierId'
      | 'routeId'
      | 'invoiceId'
      | 'actualDeliveryDate'
      | 'isActive'
      | 'createdAt'
      | 'updatedAt'
    >,
  ): Shipment {
    if (!props.companyId) throw new Error('El envío debe pertenecer a una empresa');
    if (!props.originContactId) throw new Error('El contacto de origen es requerido');
    if (!props.originAddressId) throw new Error('La dirección de origen es requerida');
    if (!props.destinationContactId) throw new Error('El contacto de destino es requerido');
    if (!props.destinationAddressId) throw new Error('La dirección de destino es requerida');
    if (!props.rateId) throw new Error('La tarifa es requerida');
    if (!props.totalWeightKg || props.totalWeightKg <= 0) {
      throw new Error('El peso total debe ser mayor a cero');
    }
    if (props.declaredValue === undefined || props.declaredValue < 0) {
      throw new Error('El valor declarado no puede ser negativo');
    }
    if (!props.estimatedDeliveryDate) {
      throw new Error('La fecha estimada de entrega es requerida');
    }

    return new Shipment({
      ...props,
      guideNumber: props.guideNumber ?? Shipment.generateGuideNumber(),
    });
  }

  static reconstitute(props: ShipmentProps): Shipment {
    return new Shipment(props);
  }

  /** Solo permite editar datos comerciales mientras el envío está recién creado. */
  update(
    props: Partial<
      Pick<ShipmentProps, 'priority' | 'totalWeightKg' | 'declaredValue' | 'estimatedDeliveryDate'>
    >,
  ): void {
    this.assertStatus([ShipmentStatus.CREATED], 'modificar');

    if (props.totalWeightKg !== undefined && props.totalWeightKg <= 0) {
      throw new Error('El peso total debe ser mayor a cero');
    }
    if (props.declaredValue !== undefined && props.declaredValue < 0) {
      throw new Error('El valor declarado no puede ser negativo');
    }

    if (props.priority !== undefined) this.priority = props.priority;
    if (props.totalWeightKg !== undefined) this.totalWeightKg = props.totalWeightKg;
    if (props.declaredValue !== undefined) this.declaredValue = props.declaredValue;
    if (props.estimatedDeliveryDate !== undefined) {
      this.estimatedDeliveryDate = props.estimatedDeliveryDate;
    }
  }

  quote(calculatedCost: number): void {
    this.assertStatus([ShipmentStatus.CREATED], 'cotizar');
    this.calculatedCost = calculatedCost;
    this.status = ShipmentStatus.QUOTED;
  }

  assign(courierId: number, routeId: number): void {
    this.assertStatus([ShipmentStatus.QUOTED], 'asignar mensajero/ruta a');
    this.courierId = courierId;
    this.routeId = routeId;
    this.status = ShipmentStatus.ASSIGNED;
  }

  startTransit(): void {
    this.assertStatus(
      [ShipmentStatus.ASSIGNED, ShipmentStatus.WITH_ISSUE],
      'poner en ruta',
    );
    this.status = ShipmentStatus.IN_TRANSIT;
  }

  reportIssue(): void {
    this.assertStatus([ShipmentStatus.IN_TRANSIT], 'reportar novedad en');
    this.status = ShipmentStatus.WITH_ISSUE;
  }

  /**
   * TODO(fase PruebaEntrega): antes de invocar esto, el use-case deberá exigir
   * que exista una PruebaEntrega válida con receptor. Por ahora la transición
   * es libre a nivel de dominio.
   */
  deliver(deliveredAt?: Date): void {
    this.assertStatus([ShipmentStatus.IN_TRANSIT], 'marcar como entregado');
    this.status = ShipmentStatus.DELIVERED;
    this.actualDeliveryDate = deliveredAt ?? new Date();
  }

  cancel(): void {
    this.assertStatus(
      [
        ShipmentStatus.CREATED,
        ShipmentStatus.QUOTED,
        ShipmentStatus.ASSIGNED,
        ShipmentStatus.IN_TRANSIT,
        ShipmentStatus.WITH_ISSUE,
      ],
      'cancelar',
    );
    this.status = ShipmentStatus.CANCELLED;
  }

  attachInvoice(invoiceId: number): void {
    this.invoiceId = invoiceId;
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}

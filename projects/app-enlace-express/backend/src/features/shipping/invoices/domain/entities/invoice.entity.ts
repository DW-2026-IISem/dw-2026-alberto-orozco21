import { InvoiceStatus } from '../enums/invoice-status.enum.js';

export interface InvoiceProps {
  id?: number;
  companyId: number;
  number: string;
  periodStart: Date;
  periodEnd: Date;
  issueDate: Date;
  subtotal: number;
  taxes: number;
  total?: number;
  status?: InvoiceStatus;
  paymentDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Invoice {
  id?: number;
  companyId: number;
  number: string;
  periodStart: Date;
  periodEnd: Date;
  issueDate: Date;
  subtotal: number;
  taxes: number;
  total: number;
  status: InvoiceStatus;
  paymentDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: InvoiceProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.number = props.number;
    this.periodStart = props.periodStart;
    this.periodEnd = props.periodEnd;
    this.issueDate = props.issueDate;
    this.subtotal = props.subtotal;
    this.taxes = props.taxes;
    this.total = props.total ?? Invoice.computeTotal(props.subtotal, props.taxes);
    this.status = props.status ?? InvoiceStatus.PENDING;
    this.paymentDate = props.paymentDate;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private static computeTotal(subtotal: number, taxes: number): number {
    return Number((subtotal + taxes).toFixed(2));
  }

  private static validateAmounts(subtotal: number, taxes: number): void {
    if (subtotal === undefined || subtotal < 0) {
      throw new Error('El subtotal debe ser un número positivo');
    }
    if (taxes === undefined || taxes < 0) {
      throw new Error('Los impuestos no pueden ser negativos');
    }
  }

  static create(
    props: Omit<
      InvoiceProps,
      'id' | 'total' | 'status' | 'paymentDate' | 'createdAt' | 'updatedAt'
    >,
  ): Invoice {
    if (!props.companyId) {
      throw new Error('La factura debe pertenecer a una empresa');
    }

    if (!props.number?.trim()) {
      throw new Error('El número de factura es requerido');
    }

    if (!props.periodStart || !props.periodEnd) {
      throw new Error('El periodo de facturación es requerido');
    }

    if (props.periodEnd < props.periodStart) {
      throw new Error('El fin del periodo debe ser posterior o igual al inicio');
    }

    if (!props.issueDate) {
      throw new Error('La fecha de emisión es requerida');
    }

    Invoice.validateAmounts(props.subtotal, props.taxes);

    return new Invoice(props);
  }

  static reconstitute(props: InvoiceProps): Invoice {
    return new Invoice(props);
  }

  /** Solo permite editar datos mientras la factura está pendiente. */
  update(
    props: Partial<
      Pick<
        InvoiceProps,
        'periodStart' | 'periodEnd' | 'issueDate' | 'subtotal' | 'taxes'
      >
    >,
  ): void {
    if (this.status !== InvoiceStatus.PENDING) {
      throw new Error(
        `No se puede modificar una factura en estado '${this.status}'`,
      );
    }

    const nextPeriodStart = props.periodStart ?? this.periodStart;
    const nextPeriodEnd = props.periodEnd ?? this.periodEnd;

    if (nextPeriodEnd < nextPeriodStart) {
      throw new Error('El fin del periodo debe ser posterior o igual al inicio');
    }

    const nextSubtotal = props.subtotal ?? this.subtotal;
    const nextTaxes = props.taxes ?? this.taxes;
    Invoice.validateAmounts(nextSubtotal, nextTaxes);

    this.periodStart = nextPeriodStart;
    this.periodEnd = nextPeriodEnd;
    if (props.issueDate !== undefined) this.issueDate = props.issueDate;
    this.subtotal = nextSubtotal;
    this.taxes = nextTaxes;
    this.total = Invoice.computeTotal(nextSubtotal, nextTaxes);
  }

  markAsPaid(paymentDate?: Date): void {
    if (this.status !== InvoiceStatus.PENDING && this.status !== InvoiceStatus.OVERDUE) {
      throw new Error(
        `Solo una factura pendiente o vencida puede marcarse como pagada (estado actual: '${this.status}')`,
      );
    }
    this.status = InvoiceStatus.PAID;
    this.paymentDate = paymentDate ?? new Date();
  }

  markAsOverdue(): void {
    if (this.status !== InvoiceStatus.PENDING) {
      throw new Error(
        `Solo una factura pendiente puede marcarse como vencida (estado actual: '${this.status}')`,
      );
    }
    this.status = InvoiceStatus.OVERDUE;
  }

  void(): void {
    if (this.status === InvoiceStatus.PAID) {
      throw new Error('No se puede anular una factura ya pagada');
    }
    this.status = InvoiceStatus.VOIDED;
  }
}

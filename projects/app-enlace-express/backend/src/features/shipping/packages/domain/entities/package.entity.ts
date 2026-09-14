export interface PackageProps {
  id?: number;
  shipmentId: number;
  contentDescription: string;
  weightKg: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  declaredValue: number;
  isFragile?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Package {
  id?: number;
  shipmentId: number;
  contentDescription: string;
  weightKg: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  declaredValue: number;
  isFragile: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: PackageProps) {
    this.id = props.id;
    this.shipmentId = props.shipmentId;
    this.contentDescription = props.contentDescription;
    this.weightKg = props.weightKg;
    this.heightCm = props.heightCm;
    this.widthCm = props.widthCm;
    this.lengthCm = props.lengthCm;
    this.declaredValue = props.declaredValue;
    this.isFragile = props.isFragile ?? false;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private static validateDimensions(props: {
    weightKg: number;
    heightCm: number;
    widthCm: number;
    lengthCm: number;
    declaredValue: number;
  }): void {
    if (!props.weightKg || props.weightKg <= 0) {
      throw new Error('El peso del paquete debe ser mayor a cero');
    }
    if (!props.heightCm || props.heightCm <= 0) {
      throw new Error('El alto del paquete debe ser mayor a cero');
    }
    if (!props.widthCm || props.widthCm <= 0) {
      throw new Error('El ancho del paquete debe ser mayor a cero');
    }
    if (!props.lengthCm || props.lengthCm <= 0) {
      throw new Error('El largo del paquete debe ser mayor a cero');
    }
    if (props.declaredValue === undefined || props.declaredValue < 0) {
      throw new Error('El valor declarado no puede ser negativo');
    }
  }

  static create(
    props: Omit<PackageProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Package {
    if (!props.shipmentId) {
      throw new Error('El paquete debe pertenecer a un envío');
    }
    if (!props.contentDescription?.trim()) {
      throw new Error('La descripción del contenido es requerida');
    }

    Package.validateDimensions(props);

    return new Package(props);
  }

  static reconstitute(props: PackageProps): Package {
    return new Package(props);
  }

  update(
    props: Partial<
      Omit<PackageProps, 'id' | 'shipmentId' | 'isActive' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    const next = {
      weightKg: props.weightKg ?? this.weightKg,
      heightCm: props.heightCm ?? this.heightCm,
      widthCm: props.widthCm ?? this.widthCm,
      lengthCm: props.lengthCm ?? this.lengthCm,
      declaredValue: props.declaredValue ?? this.declaredValue,
    };

    if (props.contentDescription !== undefined && !props.contentDescription.trim()) {
      throw new Error('La descripción del contenido es requerida');
    }

    Package.validateDimensions(next);

    if (props.contentDescription !== undefined) {
      this.contentDescription = props.contentDescription;
    }
    this.weightKg = next.weightKg;
    this.heightCm = next.heightCm;
    this.widthCm = next.widthCm;
    this.lengthCm = next.lengthCm;
    this.declaredValue = next.declaredValue;

    if (props.isFragile !== undefined) {
      this.isFragile = props.isFragile;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}

import { DomainException } from '../../../../shared/domain/domain.exception';
import { ValueObject } from '../../../../shared/domain/value-object.base';

interface Props {
  min: number;
  max: number;
  currency: string;
}

export class SalaryRange extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  static create(min: number, max: number, currency = 'USD'): SalaryRange {
    if (min < 0 || max < 0) throw new DomainException('Salary cannot be negative');
    if (min > max) throw new DomainException('Salary min cannot exceed max');
    return new SalaryRange({ min, max, currency: currency.toUpperCase() });
  }

  get min(): number { return this.props.min; }
  get max(): number { return this.props.max; }
  get currency(): string { return this.props.currency; }
}

import { DomainException } from '../../../../shared/domain/domain.exception';
import { ValueObject } from '../../../../shared/domain/value-object.base';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  static create(raw: string): Email {
    const value = raw.trim().toLowerCase();
    if (!Email.RE.test(value)) {
      throw new DomainException(`Invalid email: ${raw}`);
    }
    return new Email({ value });
  }

  get value(): string {
    return this.props.value;
  }
}

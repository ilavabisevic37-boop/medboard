import { DomainEvent } from '../../../../shared/domain/domain-event.base';
import { UserRole } from '../value-objects/user-role.vo';

export class UserRegisteredEvent implements DomainEvent {
  readonly eventName = 'users.registered';
  readonly occurredAt = new Date();

  constructor(
    readonly aggregateId: string,
    readonly email: string,
    readonly role: UserRole,
  ) {}
}

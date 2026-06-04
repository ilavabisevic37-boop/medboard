import { AggregateRoot } from '../../../../shared/domain/aggregate-root.base';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { Email } from '../value-objects/email.vo';
import { UserRole } from '../value-objects/user-role.vo';

export interface UserProps {
  email: Email;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot<string> {
  private constructor(id: string, private props: UserProps) {
    super(id);
  }

  static register(args: {
    id: string;
    email: Email;
    role: UserRole;
    firstName: string;
    lastName: string;
  }): User {
    const now = new Date();
    const user = new User(args.id, {
      email: args.email,
      role: args.role,
      firstName: args.firstName,
      lastName: args.lastName,
      createdAt: now,
      updatedAt: now,
    });
    user.addEvent(new UserRegisteredEvent(args.id, args.email.value, args.role));
    return user;
  }

  static restore(id: string, props: UserProps): User {
    return new User(id, props);
  }

  get email(): Email { return this.props.email; }
  get role(): UserRole { return this.props.role; }
  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  rename(firstName: string, lastName: string): void {
    this.props.firstName = firstName;
    this.props.lastName = lastName;
    this.props.updatedAt = new Date();
  }
}

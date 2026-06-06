import { AggregateRoot } from '../../../../shared/domain/aggregate-root.base';

export interface ConversationProps {
  applicationId: string;
  /** Derived from the application: the doctor who applied. */
  doctorId: string;
  /** Derived from the application's job: the employer who posted it. */
  employerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 1 conversation = 1 application. Participants are NOT stored — they are
 * derived from the application (doctorId + job.employerId) and passed in by
 * the repository on restore.
 */
export class Conversation extends AggregateRoot<string> {
  private constructor(id: string, private props: ConversationProps) {
    super(id);
  }

  static create(args: { id: string; applicationId: string; doctorId: string; employerId: string }): Conversation {
    const now = new Date();
    return new Conversation(args.id, { ...args, createdAt: now, updatedAt: now });
  }

  static restore(id: string, props: ConversationProps): Conversation {
    return new Conversation(id, props);
  }

  /**
   * Invariant: the only participants are the application's doctor and the
   * job's employer.
   *
   * TODO(chats): throw DomainException if userId is neither doctorId nor
   * employerId. Call this in every use-case before reading or writing.
   */
  assertParticipant(userId: string): void {
    throw new Error(`TODO: implement assertParticipant (got ${userId})`);
  }

  get applicationId(): string { return this.props.applicationId; }
  get doctorId(): string { return this.props.doctorId; }
  get employerId(): string { return this.props.employerId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}

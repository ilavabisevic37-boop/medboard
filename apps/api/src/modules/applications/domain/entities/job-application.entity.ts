import { DomainException } from '../../../../shared/domain/domain.exception';
import { AggregateRoot } from '../../../../shared/domain/aggregate-root.base';
import { ApplicationStatus } from '../value-objects/application-status.vo';

export interface JobApplicationProps {
  jobId: string;
  doctorId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class JobApplication extends AggregateRoot<string> {
  private constructor(id: string, private props: JobApplicationProps) {
    super(id);
  }

  static create(args: {
    id: string;
    jobId: string;
    doctorId: string;
    coverLetter?: string;
  }): JobApplication {
    const now = new Date();
    return new JobApplication(args.id, {
      ...args,
      status: ApplicationStatus.SUBMITTED,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(id: string, props: JobApplicationProps): JobApplication {
    return new JobApplication(id, props);
  }

  updateStatus(status: ApplicationStatus): void {
    if (this.props.status === status) return;
    if (this.props.status === ApplicationStatus.WITHDRAWN) {
      throw new DomainException('Cannot update status of a withdrawn application');
    }
    if (this.props.status === ApplicationStatus.REJECTED) {
      throw new DomainException('Cannot update status of a rejected application');
    }
    if (this.props.status === ApplicationStatus.OFFER) {
      throw new DomainException('Cannot update status of an application with an offer');
    }
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  withdraw(): void {
    if (this.props.status === ApplicationStatus.WITHDRAWN) return;
    if (
      this.props.status === ApplicationStatus.REJECTED ||
      this.props.status === ApplicationStatus.OFFER
    ) {
      throw new DomainException(`Cannot withdraw application in status ${this.props.status}`);
    }
    this.props.status = ApplicationStatus.WITHDRAWN;
    this.props.updatedAt = new Date();
  }

  reactivate(coverLetter?: string): void {
    if (this.props.status !== ApplicationStatus.WITHDRAWN) {
      throw new DomainException('Only withdrawn applications can be reactivated');
    }
    this.props.status = ApplicationStatus.SUBMITTED;
    if (coverLetter !== undefined) {
      this.props.coverLetter = coverLetter;
    }
    this.props.updatedAt = new Date();
  }

  get jobId(): string {
    return this.props.jobId;
  }

  get doctorId(): string {
    return this.props.doctorId;
  }

  get coverLetter(): string | undefined {
    return this.props.coverLetter;
  }

  get status(): ApplicationStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

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
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  withdraw(): void {
    this.props.status = ApplicationStatus.WITHDRAWN;
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

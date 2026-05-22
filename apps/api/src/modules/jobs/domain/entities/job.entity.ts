import { AggregateRoot } from '../../../../shared/domain/aggregate-root.base';
import { DomainException } from '../../../../shared/domain/domain.exception';
import { EmploymentType } from '../value-objects/employment-type.vo';
import { JobStatus } from '../value-objects/job-status.vo';
import { SalaryRange } from '../value-objects/salary-range.vo';

export interface JobProps {
  employerId: string;
  title: string;
  description: string;
  specialization: string;
  employmentType: EmploymentType;
  salary?: SalaryRange;
  city?: string;
  country?: string;
  status: JobStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Job extends AggregateRoot<string> {
  private constructor(id: string, private props: JobProps) {
    super(id);
  }

  static draft(args: {
    id: string;
    employerId: string;
    title: string;
    description: string;
    specialization: string;
    employmentType: EmploymentType;
    salary?: SalaryRange;
    city?: string;
    country?: string;
  }): Job {
    const now = new Date();
    return new Job(args.id, {
      ...args,
      status: JobStatus.Draft,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(id: string, props: JobProps): Job {
    return new Job(id, props);
  }

  publish(): void {
    if (this.props.status === JobStatus.Published) return;
    if (this.props.status === JobStatus.Archived) {
      throw new DomainException('Cannot publish an archived job');
    }
    this.props.status = JobStatus.Published;
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
  }

  close(): void {
    this.props.status = JobStatus.Closed;
    this.props.updatedAt = new Date();
  }

  get employerId(): string { return this.props.employerId; }
  get title(): string { return this.props.title; }
  get description(): string { return this.props.description; }
  get specialization(): string { return this.props.specialization; }
  get employmentType(): EmploymentType { return this.props.employmentType; }
  get salary(): SalaryRange | undefined { return this.props.salary; }
  get city(): string | undefined { return this.props.city; }
  get country(): string | undefined { return this.props.country; }
  get status(): JobStatus { return this.props.status; }
  get publishedAt(): Date | undefined { return this.props.publishedAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}

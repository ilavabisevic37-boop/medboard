import { AggregateRoot } from '../../../../shared/domain/aggregate-root.base';
import { DomainException } from '../../../../shared/domain/domain.exception';
import { EmploymentType } from '../value-objects/employment-type.vo';
import { JobStatus } from '../value-objects/job-status.vo';
import { SalaryPeriod } from '../value-objects/salary-period.vo';
import { SalaryRange } from '../value-objects/salary-range.vo';
import { Shift } from '../value-objects/shift.vo';

export interface JobProps {
  employerId: string;
  title: string;
  description: string;
  summary?: string;
  specialization: string;
  employmentType: EmploymentType;
  shift?: Shift;
  experience?: string;
  salary?: SalaryRange;
  salaryPeriod: SalaryPeriod;
  requirements: string[];
  benefits: string[];
  city?: string;
  country?: string;
  remote: boolean;
  urgent: boolean;
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
    summary?: string;
    specialization: string;
    employmentType: EmploymentType;
    shift?: Shift;
    experience?: string;
    salary?: SalaryRange;
    salaryPeriod?: SalaryPeriod;
    requirements?: string[];
    benefits?: string[];
    city?: string;
    country?: string;
    remote?: boolean;
    urgent?: boolean;
  }): Job {
    const now = new Date();
    return new Job(args.id, {
      ...args,
      salaryPeriod: args.salaryPeriod ?? SalaryPeriod.YEAR,
      requirements: args.requirements ?? [],
      benefits: args.benefits ?? [],
      remote: args.remote ?? false,
      urgent: args.urgent ?? false,
      status: JobStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(id: string, props: JobProps): Job {
    return new Job(id, props);
  }

  publish(): void {
    if (this.props.status === JobStatus.PUBLISHED) return;
    if (this.props.status === JobStatus.ARCHIVED) {
      throw new DomainException('Cannot publish an archived job');
    }
    this.props.status = JobStatus.PUBLISHED;
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
  }

  close(): void {
    this.props.status = JobStatus.CLOSED;
    this.props.updatedAt = new Date();
  }

  get employerId(): string { return this.props.employerId; }
  get title(): string { return this.props.title; }
  get description(): string { return this.props.description; }
  get summary(): string | undefined { return this.props.summary; }
  get specialization(): string { return this.props.specialization; }
  get employmentType(): EmploymentType { return this.props.employmentType; }
  get shift(): Shift | undefined { return this.props.shift; }
  get experience(): string | undefined { return this.props.experience; }
  get salary(): SalaryRange | undefined { return this.props.salary; }
  get salaryPeriod(): SalaryPeriod { return this.props.salaryPeriod; }
  get requirements(): string[] { return this.props.requirements; }
  get benefits(): string[] { return this.props.benefits; }
  get city(): string | undefined { return this.props.city; }
  get country(): string | undefined { return this.props.country; }
  get remote(): boolean { return this.props.remote; }
  get urgent(): boolean { return this.props.urgent; }
  get status(): JobStatus { return this.props.status; }
  get publishedAt(): Date | undefined { return this.props.publishedAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}

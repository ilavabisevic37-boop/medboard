import { JobSummary, SalaryPeriod } from '@medboard/shared-types';

const PERIOD_SUFFIX: Record<SalaryPeriod, string> = {
  YEAR: '/yr',
  WEEK: '/wk',
  HOUR: '/hr',
};

const compact = (n: number, currency: string): string =>
  n >= 1000
    ? `${new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
        Number((n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)),
      )}k`
    : new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

/** Human-readable salary range, mirroring the prototype's fmtSalary. */
export function formatSalary(
  job: Pick<JobSummary, 'salaryMin' | 'salaryMax' | 'salaryPeriod' | 'currency'>,
): string | null {
  if (job.salaryMin == null || job.salaryMax == null) return null;
  const suffix = PERIOD_SUFFIX[job.salaryPeriod] ?? '';
  if (job.salaryPeriod === 'YEAR') return `${compact(job.salaryMin, job.currency)}–${compact(job.salaryMax, job.currency)}`;
  const fmt = new Intl.NumberFormat('en', { style: 'currency', currency: job.currency, maximumFractionDigits: 0 });
  return `${fmt.format(job.salaryMin)}–${fmt.format(job.salaryMax)}${suffix}`;
}

const SHIFT_LABEL: Record<string, string> = {
  DAY: 'Day',
  NIGHT: 'Night',
  ROTATING: 'Rotating',
  WEEKEND: 'Weekend',
};

const EMPLOYMENT_LABEL: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  LOCUM: 'Locum',
  INTERNSHIP: 'Internship',
};

export const shiftLabel = (s?: string): string | null => (s ? SHIFT_LABEL[s] ?? s : null);
export const employmentLabel = (e: string): string => EMPLOYMENT_LABEL[e] ?? e;

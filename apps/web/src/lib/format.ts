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

const JOB_STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  DRAFT: { bg: 'warning.light', color: 'warning.main', label: 'Чернетка' },
  PUBLISHED: { bg: 'success.light', color: 'success.main', label: 'Опубліковано' },
  CLOSED: { bg: 'error.light', color: 'error.main', label: 'Закрито' },
  ARCHIVED: { bg: 'grey.300', color: 'text.secondary', label: 'Архівовано' },
};

export function getJobStatusStyle(status: string) {
  return JOB_STATUS_MAP[status] ?? { bg: 'grey.200', color: 'text.secondary', label: status };
}

const APP_STATUS_MAP: Record<string, { color: 'primary' | 'warning' | 'secondary' | 'success' | 'error' | 'default'; label: string }> = {
  SUBMITTED: { color: 'primary', label: 'Надіслано' },
  REVIEWING: { color: 'warning', label: 'Розглядається' },
  INTERVIEW: { color: 'secondary', label: 'Співбесіда' },
  OFFER: { color: 'success', label: 'Оффер' },
  REJECTED: { color: 'error', label: 'Відхилено' },
  WITHDRAWN: { color: 'default', label: 'Відкликано' },
};

export function getAppStatusStyle(status: string) {
  return APP_STATUS_MAP[status] ?? { color: 'default', label: status };
}

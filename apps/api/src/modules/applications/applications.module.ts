import { Module } from '@nestjs/common';

/**
 * Bounded context placeholder for job applications (a doctor applies to a job).
 * Follow the same layered layout as `users` and `jobs`:
 *   domain/        — entities, value-objects, repositories (interfaces), events
 *   application/   — use-cases, dtos, outbound ports
 *   infrastructure/— prisma repository, mappers, external adapters
 *   presentation/  — controllers, http dtos
 */
@Module({})
export class ApplicationsModule {}

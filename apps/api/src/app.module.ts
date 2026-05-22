import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApplicationsModule } from './modules/applications/applications.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { UsersModule } from './modules/users/users.module';
import { SharedInfrastructureModule } from './shared/infrastructure/shared-infrastructure.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedInfrastructureModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
  ],
})
export class AppModule {}

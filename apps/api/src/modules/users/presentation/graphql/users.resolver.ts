import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { SupabaseAuthGuard } from '../../../auth/presentation/guards/supabase-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';

import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { UpdateDoctorProfileUseCase } from '../../application/use-cases/update-doctor-profile.use-case';
import { UpdateEmployerProfileUseCase } from '../../application/use-cases/update-employer-profile.use-case';

import { UserType } from './user.type';
import { DoctorProfileType } from './doctor-profile.type';
import { EmployerProfileType } from './employer-profile.type';
import { UpdateDoctorProfileInput } from './update-doctor-profile.input';
import { UpdateEmployerProfileInput } from './update-employer-profile.input';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateDoctorProfileUseCase: UpdateDoctorProfileUseCase,
    private readonly updateEmployerProfileUseCase: UpdateEmployerProfileUseCase,
  ) {}

  @Query(() => UserType, { name: 'me' })
  @UseGuards(SupabaseAuthGuard)
  async me(@CurrentUser() user: { id: string }): Promise<UserType> {
    return this.getUserUseCase.execute(user.id);
  }

  @ResolveField(() => DoctorProfileType, { nullable: true })
  doctorProfile(@Parent() user: UserType & { doctorProfile?: any }) {
    return user.doctorProfile || undefined;
  }

  @ResolveField(() => EmployerProfileType, { nullable: true })
  employerProfile(@Parent() user: UserType & { employerProfile?: any }) {
    return user.employerProfile || undefined;
  }

  @Mutation(() => DoctorProfileType, { name: 'updateDoctorProfile' })
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  async updateDoctorProfile(
    @CurrentUser() user: { id: string },
    @Args('input') input: UpdateDoctorProfileInput,
  ): Promise<DoctorProfileType> {
    return this.updateDoctorProfileUseCase.execute(user.id, input);
  }

  @Mutation(() => EmployerProfileType, { name: 'updateEmployerProfile' })
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('EMPLOYER')
  async updateEmployerProfile(
    @CurrentUser() user: { id: string },
    @Args('input') input: UpdateEmployerProfileInput,
  ): Promise<EmployerProfileType> {
    return this.updateEmployerProfileUseCase.execute(user.id, input);
  }
}

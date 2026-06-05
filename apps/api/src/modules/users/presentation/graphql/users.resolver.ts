import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

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

  // Auth is enforced by the global SupabaseAuthGuard/RolesGuard (APP_GUARD in
  // AuthModule); method-level @UseGuards would require AuthModule providers in
  // this module's DI context and break bootstrapping.
  @Query(() => UserType, { name: 'me' })
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
  @Roles('DOCTOR')
  async updateDoctorProfile(
    @CurrentUser() user: { id: string },
    @Args('input') input: UpdateDoctorProfileInput,
  ): Promise<DoctorProfileType> {
    return this.updateDoctorProfileUseCase.execute(user.id, input);
  }

  @Mutation(() => EmployerProfileType, { name: 'updateEmployerProfile' })
  @Roles('EMPLOYER')
  async updateEmployerProfile(
    @CurrentUser() user: { id: string },
    @Args('input') input: UpdateEmployerProfileInput,
  ): Promise<EmployerProfileType> {
    return this.updateEmployerProfileUseCase.execute(user.id, input);
  }
}

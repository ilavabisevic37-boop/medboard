import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';

import { DomainException } from '../domain/domain.exception';

/**
 * Domain invariant violations are client errors, not server crashes:
 * map DomainException → 400 (BAD_REQUEST in GraphQL extensions) globally,
 * so domain code stays framework-free and use-cases don't wrap try/catch.
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, _host: ArgumentsHost): never {
    throw new BadRequestException(exception.message);
  }
}

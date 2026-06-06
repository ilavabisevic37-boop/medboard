import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, MaxLength } from 'class-validator';

import { MESSAGE_BODY_MAX_LENGTH } from '../../domain/entities/message.entity';

@InputType()
export class SendMessageInputType {
  // The global ValidationPipe (whitelist + forbidNonWhitelisted) rejects any
  // input class without class-validator decorators — keep every field decorated.
  @Field(() => ID) @IsUUID() conversationId!: string;
  // Emptiness is checked in the domain (after trim); here only shape/cap.
  @Field() @IsString() @MaxLength(MESSAGE_BODY_MAX_LENGTH) body!: string;
}

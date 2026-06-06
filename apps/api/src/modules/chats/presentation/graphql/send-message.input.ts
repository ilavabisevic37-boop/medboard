import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class SendMessageInputType {
  @Field(() => ID) conversationId!: string;
  @Field() body!: string;
}

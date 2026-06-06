import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageType {
  @Field(() => ID) id!: string;
  @Field(() => ID) conversationId!: string;
  @Field(() => ID) senderId!: string;
  @Field() body!: string;
  @Field(() => GraphQLISODateTime, { nullable: true }) readAt?: Date;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
}

/** One row of the `/messages` inbox. */
@ObjectType()
export class ConversationSummaryType {
  @Field(() => ID) id!: string;
  @Field(() => ID) applicationId!: string;
  @Field(() => ID) jobId!: string;
  @Field() jobTitle!: string;
  @Field(() => ID) counterpartId!: string;
  @Field() counterpartName!: string;
  @Field(() => MessageType, { nullable: true }) lastMessage?: MessageType;
  @Field(() => Int) unreadCount!: number;
  @Field(() => GraphQLISODateTime) updatedAt!: Date;
}

@ObjectType()
export class ConversationDetailType {
  @Field(() => ID) id!: string;
  @Field(() => ID) applicationId!: string;
  @Field(() => ID) jobId!: string;
  @Field() jobTitle!: string;
  @Field(() => ID) counterpartId!: string;
  @Field() counterpartName!: string;
  /** Newest-first page; client reverses for display. */
  @Field(() => [MessageType]) messages!: MessageType[];
}

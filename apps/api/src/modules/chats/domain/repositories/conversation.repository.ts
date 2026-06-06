import { Conversation } from '../entities/conversation.entity';

export interface ConversationRepository {
  findById(id: string): Promise<Conversation | null>;
  findByApplicationId(applicationId: string): Promise<Conversation | null>;
  /** All conversations where the user is the doctor or the employer side. */
  findByParticipant(userId: string): Promise<Conversation[]>;
  save(conversation: Conversation): Promise<void>;
}

export const CONVERSATION_REPOSITORY = Symbol('ConversationRepository');

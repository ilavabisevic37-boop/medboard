import { Message } from '../../domain/entities/message.entity';
import { MessageReadModel } from './conversation.read-model';

export function toMessageReadModel(message: Message): MessageReadModel {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    body: message.body,
    readAt: message.readAt,
    createdAt: message.createdAt,
  };
}

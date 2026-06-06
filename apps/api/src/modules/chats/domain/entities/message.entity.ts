import { Entity } from '../../../../shared/domain/entity.base';

export const MESSAGE_BODY_MAX_LENGTH = 4000;

export interface MessageProps {
  conversationId: string;
  senderId: string;
  body: string;
  readAt?: Date;
  createdAt: Date;
}

export class Message extends Entity<string> {
  private constructor(id: string, private props: MessageProps) {
    super(id);
  }

  /**
   * TODO(chats): validate body here — non-empty after trim, length up to
   * MESSAGE_BODY_MAX_LENGTH; throw DomainException otherwise.
   */
  static create(args: { id: string; conversationId: string; senderId: string; body: string }): Message {
    return new Message(args.id, {
      conversationId: args.conversationId,
      senderId: args.senderId,
      body: args.body,
      createdAt: new Date(),
    });
  }

  static restore(id: string, props: MessageProps): Message {
    return new Message(id, props);
  }

  get conversationId(): string { return this.props.conversationId; }
  get senderId(): string { return this.props.senderId; }
  get body(): string { return this.props.body; }
  get readAt(): Date | undefined { return this.props.readAt; }
  get createdAt(): Date { return this.props.createdAt; }
}

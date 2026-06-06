/**
 * Read-side port: cross-context projection data for chat views (job title,
 * participant names). Lives behind a port because the application layer must
 * not know Prisma; implemented in infrastructure with one joined query.
 */

export interface ConversationContext {
  conversationId: string;
  jobId: string;
  jobTitle: string;
  doctorId: string;
  doctorName: string;
  employerId: string;
  /** Company name when the employer has a profile, falls back to full name. */
  employerName: string;
}

export interface ChatContextReader {
  getByConversationIds(ids: string[]): Promise<ConversationContext[]>;
}

export const CHAT_CONTEXT_READER = Symbol('ChatContextReader');

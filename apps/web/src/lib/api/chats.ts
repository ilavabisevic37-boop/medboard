import { gql } from 'graphql-request';

import { ChatMessage, ConversationDetail, ConversationSummary } from '@medboard/shared-types';

import { gqlClient } from '../graphql/client';
import { getWsClient } from '../graphql/ws-client';

const MESSAGE_FIELDS = gql`
  fragment MessageFields on MessageType {
    id
    conversationId
    senderId
    body
    readAt
    createdAt
  }
`;

const MY_CONVERSATIONS_QUERY = gql`
  ${MESSAGE_FIELDS}
  query MyConversations {
    myConversations {
      id
      applicationId
      jobId
      jobTitle
      counterpartId
      counterpartName
      lastMessage {
        ...MessageFields
      }
      unreadCount
      updatedAt
    }
  }
`;

const CONVERSATION_QUERY = gql`
  ${MESSAGE_FIELDS}
  query Conversation($id: ID!, $before: ID, $limit: Int) {
    conversation(id: $id, before: $before, limit: $limit) {
      id
      applicationId
      jobId
      jobTitle
      counterpartId
      counterpartName
      messages {
        ...MessageFields
      }
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  ${MESSAGE_FIELDS}
  mutation SendMessage($input: SendMessageInputType!) {
    sendMessage(input: $input) {
      ...MessageFields
    }
  }
`;

const MARK_READ_MUTATION = gql`
  mutation MarkConversationRead($id: ID!) {
    markConversationRead(id: $id)
  }
`;

const MESSAGE_ADDED_SUBSCRIPTION = gql`
  ${MESSAGE_FIELDS}
  subscription MessageAdded($conversationId: ID!) {
    messageAdded(conversationId: $conversationId) {
      ...MessageFields
    }
  }
`;

export async function fetchMyConversations(): Promise<ConversationSummary[]> {
  const data = await gqlClient.request<{ myConversations: ConversationSummary[] }>(
    MY_CONVERSATIONS_QUERY,
  );
  return data.myConversations;
}

export async function fetchConversation(
  id: string,
  opts: { before?: string; limit?: number } = {},
): Promise<ConversationDetail> {
  const data = await gqlClient.request<{ conversation: ConversationDetail }>(
    CONVERSATION_QUERY,
    { id, ...opts },
  );
  return data.conversation;
}

export async function sendMessage(conversationId: string, body: string): Promise<ChatMessage> {
  const data = await gqlClient.request<{ sendMessage: ChatMessage }>(SEND_MESSAGE_MUTATION, {
    input: { conversationId, body },
  });
  return data.sendMessage;
}

export async function markConversationRead(id: string): Promise<boolean> {
  const data = await gqlClient.request<{ markConversationRead: boolean }>(MARK_READ_MUTATION, {
    id,
  });
  return data.markConversationRead;
}

/**
 * Live messages for a conversation. Returns an unsubscribe function —
 * always call it on unmount or the ws subscription leaks.
 */
export function subscribeToMessages(
  conversationId: string,
  onMessage: (message: ChatMessage) => void,
  onError?: (error: unknown) => void,
): () => void {
  return getWsClient().subscribe<{ messageAdded: ChatMessage }>(
    { query: MESSAGE_ADDED_SUBSCRIPTION, variables: { conversationId } },
    {
      next: (result) => {
        if (result.data?.messageAdded) onMessage(result.data.messageAdded);
      },
      error: (err) => onError?.(err),
      complete: () => undefined,
    },
  );
}

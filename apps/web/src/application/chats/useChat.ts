'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ChatMessage, ConversationDetail } from '@medboard/shared-types';

import {
  fetchConversation,
  markConversationRead,
  sendMessage as sendMessageApi,
  subscribeToMessages,
} from '../../lib/api/chats';

export interface UseChatResult {
  conversation: Omit<ConversationDetail, 'messages'> | null;
  /** Oldest-first — ready for top-to-bottom rendering. */
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sending: boolean;
  send: (body: string) => Promise<void>;
}

/**
 * History → live subscription → send. Basic happy path is wired; the
 * polish is left as TODOs:
 *
 * TODO(chats-ui): optimistic send — append a temp message immediately,
 *   reconcile by id when the real one arrives (own messages also come back
 *   through the subscription — the id-dedup below already absorbs that).
 * TODO(chats-ui): load older messages — call fetchConversation with
 *   `before: messages[0]?.id` on scroll-to-top and prepend.
 * TODO(chats-ui): refetch history when the ws client reconnects
 *   (getWsClient().on('connected', ...)) — messages sent while offline are
 *   missed otherwise.
 */
export function useChat(conversationId: string): UseChatResult {
  const [conversation, setConversation] = useState<UseChatResult['conversation']>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const seenIds = useRef(new Set<string>());

  const append = useCallback((message: ChatMessage) => {
    // Own messages arrive twice (mutation response + subscription) — dedup by id.
    if (seenIds.current.has(message.id)) return;
    seenIds.current.add(message.id);
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    seenIds.current = new Set();
    setLoading(true);
    setError(null);
    setMessages([]);

    fetchConversation(conversationId)
      .then((detail) => {
        if (cancelled) return;
        const { messages: page, ...rest } = detail;
        const oldestFirst = [...page].reverse();
        oldestFirst.forEach((m) => seenIds.current.add(m.id));
        setConversation(rest);
        setMessages(oldestFirst);
        // Opening the conversation reads it.
        void markConversationRead(conversationId);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : 'Failed to load chat'))
      .finally(() => !cancelled && setLoading(false));

    const unsubscribe = subscribeToMessages(conversationId, (message) => {
      append(message);
      // A message that arrives while the window is open is read immediately.
      void markConversationRead(conversationId);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [conversationId, append]);

  const send = useCallback(
    async (body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      setSending(true);
      try {
        append(await sendMessageApi(conversationId, trimmed));
      } finally {
        setSending(false);
      }
    },
    [conversationId, append],
  );

  return { conversation, messages, loading, error, sending, send };
}

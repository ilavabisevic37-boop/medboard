'use client';

import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

import { ChatMessage } from '@medboard/shared-types';

import { formatTime } from './chat-format';

interface MessageListProps {
  messages: ChatMessage[];
  /** Messages NOT from the counterpart are rendered as "mine" (right side). */
  counterpartId: string;
}

export function MessageList({ messages, counterpartId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // TODO(chats-ui): only autoscroll when the user is already near the bottom,
  // and add a scroll-to-top loader for older pages (useChat TODO).
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {messages.map((m) => {
        const mine = m.senderId !== counterpartId;
        return (
          <Box key={m.id} sx={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
            <Box
              sx={{
                maxWidth: '70%',
                px: 1.75,
                py: 1.1,
                borderRadius: 3,
                borderBottomRightRadius: mine ? 6 : 24,
                borderBottomLeftRadius: mine ? 24 : 6,
                bgcolor: mine ? 'primary.main' : '#F1F5F9',
                color: mine ? '#fff' : 'text.primary',
              }}
            >
              <Typography sx={{ fontSize: '0.9375rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {m.body}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.6875rem',
                  mt: 0.25,
                  textAlign: 'right',
                  color: mine ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                }}
              >
                {formatTime(m.createdAt)}
              </Typography>
            </Box>
          </Box>
        );
      })}
      <div ref={bottomRef} />
    </Box>
  );
}

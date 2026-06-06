'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';

import { ConversationSummary } from '@medboard/shared-types';

import { fetchMyConversations } from '../../lib/api/chats';
import { formatLastActivity, initials } from './chat-format';

export function ConversationList() {
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyConversations()
      .then(setConversations)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load messages'));
  }, []);

  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  if (!conversations) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (conversations.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
        <ForumRoundedIcon sx={{ fontSize: 44, mb: 1, opacity: 0.4 }} />
        <Typography sx={{ fontWeight: 600 }}>No messages yet</Typography>
        <Typography sx={{ fontSize: '0.875rem' }}>
          Conversations start when you apply to a job (or receive an application).
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {conversations.map((c) => (
        <Box
          key={c.id}
          component={Link}
          href={`/messages/${c.id}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            px: 2.5,
            py: 1.75,
            textDecoration: 'none',
            color: 'inherit',
            borderBottom: '1px solid',
            borderColor: 'divider',
            transition: 'background 0.14s',
            '&:hover': { bgcolor: '#F8FAFC' },
          }}
        >
          <Badge badgeContent={c.unreadCount} color="primary" overlap="circular">
            <Avatar sx={{ width: 44, height: 44, bgcolor: '#EDF2F9', color: '#1D3461', fontWeight: 700, fontSize: 15 }}>
              {initials(c.counterpartName)}
            </Avatar>
          </Badge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ fontWeight: c.unreadCount ? 700 : 600, fontSize: '0.9375rem' }} noWrap>
                {c.counterpartName}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flexShrink: 0 }}>
                {formatLastActivity(c.updatedAt)}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8125rem', color: 'primary.dark' }} noWrap>
              {c.jobTitle}
            </Typography>
            {c.lastMessage && (
              <Typography
                sx={{
                  fontSize: '0.8438rem',
                  color: c.unreadCount ? 'text.primary' : 'text.secondary',
                  fontWeight: c.unreadCount ? 600 : 400,
                }}
                noWrap
              >
                {c.lastMessage.body}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

'use client';

import Link from 'next/link';
import { Alert, Avatar, Box, CircularProgress, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import { useChat } from '../../application/chats/useChat';
import { initials } from './chat-format';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

interface ChatWindowProps {
  conversationId: string;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { conversation, messages, loading, error, sending, send } = useChat(conversationId);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !conversation) {
    return <Alert severity="error" sx={{ m: 3 }}>{error ?? 'Conversation not found'}</Alert>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 70px)', // header is 70px
        maxWidth: 860,
        mx: 'auto',
        bgcolor: '#fff',
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header: counterpart + job context */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.75, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box component={Link} href="/messages" sx={{ display: 'flex', color: 'text.secondary' }}>
          <ArrowBackRoundedIcon sx={{ fontSize: 22 }} />
        </Box>
        <Avatar sx={{ width: 38, height: 38, bgcolor: '#EDF2F9', color: '#1D3461', fontWeight: 700, fontSize: 14 }}>
          {initials(conversation.counterpartName)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 650, fontSize: '0.9375rem' }}>
            {conversation.counterpartName}
          </Typography>
          <Typography
            component={Link}
            href={`/jobs/${conversation.jobId}`}
            sx={{ fontSize: '0.8125rem', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
          >
            {conversation.jobTitle}
          </Typography>
        </Box>
      </Box>

      <MessageList messages={messages} counterpartId={conversation.counterpartId} />
      <MessageInput onSend={send} disabled={sending} />
    </Box>
  );
}

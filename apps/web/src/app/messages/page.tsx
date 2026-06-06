import { Container, Typography } from '@mui/material';

import { ConversationList } from '../../components/chat/ConversationList';

// TODO(chats-ui): protect this route in middleware.ts (no session → /login?next=/messages)
// — part of the auth-foundation task.
export default function MessagesPage() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Messages
      </Typography>
      <ConversationList />
    </Container>
  );
}

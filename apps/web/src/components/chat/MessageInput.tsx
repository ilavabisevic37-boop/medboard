'use client';

import { useState } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

interface MessageInputProps {
  onSend: (body: string) => Promise<void>;
  disabled?: boolean;
}

/** Enter — send, Shift+Enter — newline. */
export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('');

  const submit = async () => {
    const body = value.trim();
    if (!body || disabled) return;
    setValue('');
    try {
      await onSend(body);
    } catch {
      setValue(body); // give the text back so it isn't lost on failure
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', px: 2.5, py: 1.75, borderTop: '1px solid', borderColor: 'divider' }}>
      <TextField
        fullWidth
        multiline
        maxRows={6}
        size="small"
        placeholder="Write a message…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void submit();
          }
        }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F8FAFC' } }}
      />
      <IconButton
        color="primary"
        onClick={() => void submit()}
        disabled={disabled || !value.trim()}
        sx={{ width: 42, height: 42 }}
      >
        <SendRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
}

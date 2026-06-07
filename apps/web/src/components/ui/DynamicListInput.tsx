'use client';

import React, { useState } from 'react';
import { Typography, Stack, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface DynamicListInputProps {
  title: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}

export function DynamicListInput({ title, placeholder, items, onChange }: DynamicListInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <>
      <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          placeholder={placeholder}
          fullWidth
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        />
        <Button variant="outlined" onClick={handleAdd} startIcon={<AddIcon />}>
          Додати
        </Button>
      </Stack>
      <List dense sx={{ mb: 3 }}>
        {items.map((item, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRemove(idx)}>
                <DeleteIcon color="error" />
              </IconButton>
            }
            sx={{ bgcolor: 'background.default', borderRadius: 2, mb: 1 }}
          >
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </>
  );
}

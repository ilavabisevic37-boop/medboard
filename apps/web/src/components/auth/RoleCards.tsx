"use client";

import React from 'react';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { Box, ButtonBase, Typography } from '@mui/material';

import type { SignUpRole } from '../../domain/auth/credentials.schema';

const ROLE_OPTIONS: Array<{
  role: SignUpRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    role: 'DOCTOR',
    title: "I'm a professional",
    description: 'Find shifts & roles',
    icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 20 }} />,
  },
  {
    role: 'EMPLOYER',
    title: "I'm hiring",
    description: 'Clinic or hospital',
    icon: <BusinessRoundedIcon sx={{ fontSize: 20 }} />,
  },
];

interface RoleCardsProps {
  value: SignUpRole;
  onChange: (role: SignUpRole) => void;
}

export function RoleCards({ value, onChange }: RoleCardsProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {ROLE_OPTIONS.map((option) => {
        const selected = option.role === value;
        return (
          <ButtonBase
            key={option.role}
            onClick={() => onChange(option.role)}
            aria-pressed={selected}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              gap: '3px',
              p: '16px',
              borderRadius: '12px',
              border: '1.6px solid',
              borderColor: selected ? 'primary.main' : 'divider',
              bgcolor: selected ? '#EDF2F9' : 'background.paper',
              transition: 'all 0.14s ease',
              '&:hover': {
                borderColor: selected ? 'primary.main' : 'primary.light',
              },
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '11px',
                bgcolor: selected ? 'primary.main' : '#F6F8FB',
                color: selected ? '#fff' : 'primary.dark',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: '8px',
                transition: 'all 0.14s ease',
              }}
            >
              {option.icon}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em' }}>
              {option.title}
            </Typography>
            <Typography sx={{ fontSize: '12.5px', color: 'text.secondary' }}>
              {option.description}
            </Typography>
            <CheckCircleRoundedIcon
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontSize: 18,
                color: 'primary.main',
                opacity: selected ? 1 : 0,
                transition: 'opacity 0.14s ease',
              }}
            />
          </ButtonBase>
        );
      })}
    </Box>
  );
}

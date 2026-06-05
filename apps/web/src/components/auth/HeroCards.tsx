import React from 'react';
import { Box, Typography } from '@mui/material';

export default function HeroCards() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '340px',
        height: '170px',
        my: '40px',
        alignSelf: 'flex-start',
      }}
    >
      {/* Card 1: Job Offer (Back card, slightly offset top-left) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '90%',
          bgcolor: 'background.paper',
          borderRadius: '18px',
          boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.08)',
          p: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            zIndex: 3,
          },
        }}
      >
        {/* Avatar with Slate/Blue background */}
        <Box
          sx={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            bgcolor: 'primary.light',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          BH
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: '13px',
              fontWeight: 700,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            ICU Registered Nurse
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: '11px',
              fontWeight: 400,
              lineHeight: 1.3,
              mt: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Beacon Hill Medical Center
          </Typography>
        </Box>

        {/* Salary Info */}
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography
            sx={{
              color: 'secondary.main',
              fontSize: '12px',
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            $96k-
          </Typography>
          <Typography
            sx={{
              color: 'secondary.main',
              fontSize: '12px',
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            $124k
          </Typography>
        </Box>
      </Box>

      {/* Card 2: Professional Status (Front card, shifted bottom-right, overlapping Card 1) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '88%',
          bgcolor: 'background.paper',
          borderRadius: '18px',
          boxShadow: '0px 14px 34px rgba(0, 0, 0, 0.12)',
          p: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 2,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            zIndex: 3,
          },
        }}
      >
        {/* Avatar with Teal background */}
        <Box
          sx={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            bgcolor: 'success.light',
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          JW
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: '13px',
              fontWeight: 700,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            James Whitfield
          </Typography>
          
          {/* Status Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              bgcolor: 'success.light',
              borderRadius: '20px',
              px: '8px',
              py: '2px',
              mt: '4px',
            }}
          >
            <Box
              sx={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                bgcolor: 'success.main',
              }}
            />
            <Typography
              sx={{
                color: 'success.dark',
                fontSize: '10px',
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              Available now
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

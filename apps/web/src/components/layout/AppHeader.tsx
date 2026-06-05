'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';

import { Logo } from '../ui/Logo';

const NAV_ITEMS = [
  { key: 'jobs', label: 'Find jobs', href: '/jobs' },
  { key: 'saved', label: 'Saved', href: '#' },
  { key: 'messages', label: 'Messages', href: '#' },
];

export function AppHeader() {
  const pathname = usePathname();
  const isActive = (key: string) =>
    key === 'jobs' ? pathname.startsWith('/jobs') : pathname === key;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        height: 70,
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'saturate(1.4) blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3.5 } }}>
        <Toolbar
          disableGutters
          sx={{ height: 70, gap: { xs: 2, md: 3.25 } }}
        >
          <Logo size={26} />

          {/* Desktop nav */}
          <Box
            component="nav"
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              ml: 2,
            }}
          >
            {NAV_ITEMS.map((n) => (
              <Box
                key={n.key}
                component={Link}
                href={n.href}
                sx={{
                  px: 1.75,
                  py: 1.1,
                  borderRadius: 999,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: isActive(n.key) ? 'primary.dark' : 'text.secondary',
                  bgcolor: isActive(n.key) ? '#EDF2F9' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.14s',
                  '&:hover': {
                    bgcolor: isActive(n.key) ? '#EDF2F9' : '#F6F8FB',
                    color: isActive(n.key) ? 'primary.dark' : 'text.primary',
                  },
                }}
              >
                {n.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Role switch */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              bgcolor: '#F6F8FB',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 999,
              p: '3px',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.6,
                py: 0.9,
                borderRadius: 999,
                bgcolor: '#fff',
                color: 'primary.dark',
                boxShadow: '0 1px 2px rgba(30,50,80,0.06)',
                fontSize: '0.8125rem',
                fontWeight: 650,
                cursor: 'pointer',
              }}
            >
              <PersonOutlineRoundedIcon sx={{ fontSize: 16 }} />
              Professional
            </Box>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.6,
                py: 0.9,
                borderRadius: 999,
                color: '#8896A6',
                fontSize: '0.8125rem',
                fontWeight: 650,
                cursor: 'pointer',
                transition: 'all 0.14s',
                '&:hover': { color: 'text.secondary' },
              }}
            >
              <BusinessRoundedIcon sx={{ fontSize: 16 }} />
              Clinic
            </Box>
          </Box>

          {/* Notification */}
          <IconButton
            sx={{
              width: 42,
              height: 42,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: '#fff',
              color: 'text.secondary',
              '&:hover': { borderColor: '#A0AEC0', color: 'text.primary' },
            }}
          >
            <Badge variant="dot" color="error" overlap="circular">
              <NotificationsNoneRoundedIcon sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>

          {/* Avatar */}
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: '#EDF2F9',
              color: '#1D3461',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              border: '2px solid #fff',
              boxShadow: '0 0 0 1.5px #E2E8F0',
            }}
          >
            DA
          </Avatar>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

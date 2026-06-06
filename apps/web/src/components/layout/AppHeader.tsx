'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Stack,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';

import { Logo } from '../ui/Logo';
import { useAuth } from '../../application/auth/useAuth';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, firstName, lastName, isAuthenticated, loading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActive = (href: string) => {
    if (href === '/jobs') return pathname.startsWith('/jobs') && pathname !== '/jobs/new';
    return pathname === href;
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseMenu();
    await logout();
  };

  // Build nav items dynamically
  const navItems = [
    { label: 'Вакансії', href: '/jobs' },
  ];

  if (isAuthenticated && !loading) {
    if (role === 'DOCTOR') {
      navItems.push({ label: 'Мої відгуки', href: '/applications' });
    } else if (role === 'EMPLOYER') {
      navItems.push({ label: 'Кабінет', href: '/dashboard' });
      navItems.push({ label: 'Створити вакансію', href: '/jobs/new' });
    }
  }

  // Get initials
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        height: 70,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'saturate(1.4) blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3.5 } }}>
        <Toolbar disableGutters sx={{ height: 70, gap: { xs: 2, md: 3.25 } }}>
          <Logo size={26} />

          {/* Desktop Nav */}
          <Box
            component="nav"
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              ml: 2,
            }}
          >
            {navItems.map((n) => {
              const active = isActive(n.href);
              return (
                <Box
                  key={n.href}
                  component={Link}
                  href={n.href}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 999,
                    fontSize: '0.9375rem',
                    fontWeight: 650,
                    color: active ? 'primary.dark' : 'text.secondary',
                    bgcolor: active ? '#EDF2F9' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                      bgcolor: active ? '#EDF2F9' : '#F6F8FB',
                      color: active ? 'primary.dark' : 'text.primary',
                    },
                  }}
                >
                  {n.label}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Auth State */}
          {!loading && (
            <>
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    {firstName ? `${firstName} ${lastName}` : user.email}
                  </Typography>
                  <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        fontWeight: 750,
                        fontSize: 13,
                        border: '2px solid #fff',
                        boxShadow: '0 0 0 1.5px #E2E8F0',
                      }}
                    >
                      {getInitials()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    onClick={handleCloseMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        borderRadius: 3,
                        minWidth: 200,
                        border: '1px solid',
                        borderColor: 'divider',
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                        {firstName ? `${firstName} ${lastName}` : 'Користувач'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {role === 'DOCTOR' ? 'Лікар' : 'Роботодавець'}
                      </Typography>
                    </Box>

                    {role === 'EMPLOYER' && (
                      <MenuItem onClick={() => router.push('/dashboard')}>
                        <DashboardRoundedIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
                        Кабінет
                      </MenuItem>
                    )}

                    {role === 'DOCTOR' && (
                      <MenuItem onClick={() => router.push('/applications')}>
                        <DashboardRoundedIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
                        Мої відгуки
                      </MenuItem>
                    )}

                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <ExitToAppRoundedIcon sx={{ mr: 1.5, fontSize: 20, color: 'error.main' }} />
                      Вийти
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Button
                    component={Link}
                    href="/login"
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      px: 3,
                      py: 0.75,
                      fontWeight: 650,
                      fontSize: '0.875rem',
                    }}
                  >
                    Увійти
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    sx={{
                      borderRadius: 999,
                      px: 3,
                      py: 0.75,
                      fontWeight: 650,
                      fontSize: '0.875rem',
                      boxShadow: 'none',
                    }}
                  >
                    Реєстрація
                  </Button>
                </Stack>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

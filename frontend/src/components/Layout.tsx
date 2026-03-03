import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Stack,
  Avatar,
  Slide,
  useScrollTrigger,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  DirectionsBus as BusIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  HomeRounded as HomeIcon,
  SettingsOutlined as SettingsIcon,
} from '@mui/icons-material';
import { NavLink, Link as RouterLink, Outlet } from 'react-router-dom';
import { useColorMode } from '../contexts/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';

function HideOnScroll({ children }: { children: JSX.Element }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Layout() {
  const { mode, toggle } = useColorMode();
  const { isAuthenticated, logout } = useAuth();

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="background.default">
      <HideOnScroll>
        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{
            top: 16,
            left: 0,
            right: 0,
            mx: 'auto',
            width: 'calc(100% - 32px)',
            maxWidth: '1400px',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            zIndex: 1100,
            borderRadius: 4,
            border: mode === 'light' ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.1)',
            bgcolor: mode === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(15, 23, 42, 0.5)',
            boxShadow: mode === 'light' ? '0 8px 32px rgba(0, 0, 0, 0.05)' : '0 8px 32px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Toolbar sx={{ gap: 2, minHeight: '64px !important', px: { xs: 2, md: 3 } }}>
            <Box
              component={RouterLink as any}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': { transform: 'scale(1.05)' },
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: mode === 'light' ? '#3b82f6' : '#2dd4bf',
                  mr: 1.5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <BusIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.5, bgclip: "text" }}>
                ShuttleNow
              </Typography>
            </Box>

            {/* Main Navigation - Visible clearly in the center/left */}
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, flexGrow: 1 }}>
              {[
                { to: '/', label: 'Home', icon: <HomeIcon fontSize="small" /> },
                { to: '/find-booking', label: 'Find Bookings', icon: <SearchIcon fontSize="small" /> },
                { to: '/admin/login', label: 'Admin', icon: <AdminIcon fontSize="small" /> },
              ].map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  startIcon={item.icon}
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&.active': {
                      color: mode === 'light' ? 'primary.main' : '#2dd4bf',
                      bgcolor: mode === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(45, 212, 191, 0.15)',
                    },
                    '&:hover': {
                      color: mode === 'light' ? 'primary.dark' : '#5eead4',
                      bgcolor: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              {isAuthenticated ? (
                <>
                  <Button
                    component={NavLink}
                    to="/my-bookings"
                    startIcon={<DashboardIcon />}
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 2, py: 1 }}
                  >
                    My Bookings
                  </Button>
                  <Button
                    onClick={logout}
                    startIcon={<LogoutIcon />}
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 2, py: 1 }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={NavLink}
                    to="/login"
                    startIcon={<LoginIcon />}
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 800,
                      px: 3,
                      py: 1,
                      backgroundImage: mode === 'light' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                      boxShadow: mode === 'light' ? '0 4px 14px rgba(59, 130, 246, 0.4)' : '0 4px 14px rgba(45, 212, 191, 0.4)'
                    }}
                  >
                    Sign In
                  </Button>
                </>
              )}
              <IconButton
                onClick={toggle}
                size="small"
                sx={{
                  color: 'text.primary',
                  bgcolor: mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }
                }}
              >
                {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
              </IconButton>

              {isAuthenticated && (
                <IconButton
                  component={RouterLink as any}
                  to="/settings"
                  size="small"
                  sx={{
                    color: 'text.primary',
                    bgcolor: mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Box component="main" sx={{ flex: 1, position: 'relative', pt: '96px' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
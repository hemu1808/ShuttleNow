import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Container,
  Stack,
  Avatar,
  Slide,
  useScrollTrigger,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  DirectionsBus as BusIcon,
  Search as SearchIcon,
  CheckCircle as SuccessIcon,
  AdminPanelSettings as AdminIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material';
import { NavLink, Link as RouterLink, Outlet } from 'react-router-dom';
import GlassCard from './GlassCard';
import { useColorMode } from './ThemeProvider';
import { useAuth } from './AuthContext';

function HideOnScroll({ children }: { children: JSX.Element }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// REMOVED: const LogoContainer = styled(Box)... (This was causing the error)

export default function Layout() {
  const { mode, toggle } = useColorMode();
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Home', icon: <BusIcon fontSize="small" /> },
    { to: '/find-booking', label: 'Find Booking', icon: <SearchIcon fontSize="small" /> },
    { to: '/booking-success', label: 'Success', icon: <SuccessIcon fontSize="small" /> },
    { to: '/admin/login', label: 'Admin', icon: <AdminIcon fontSize="small" /> },
    { to: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
  ];

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <HideOnScroll>
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(20px)' }}>
          <Toolbar sx={{ gap: 2 }}>
            {/* FIXED: Replaced LogoContainer with Box and moved styles to sx */}
            <Box
              component={RouterLink as any} // 'as any' prevents the strict type conflict
              to="/"
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                textDecoration: 'none', // Ensures link doesn't look like text
                color: 'inherit',       // Inherits text color
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: mode === 'light' ? '#0D47A1' : '#00695C',
                  mr: 1,
                }}
              >
                <BusIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                ShuttleNow
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((i) => (
                <Button
                  key={i.to}
                  component={NavLink}
                  to={i.to}
                  startIcon={i.icon}
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  {i.label}
                </Button>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {isAuthenticated ? (
                <Button
                  onClick={logout}
                  startIcon={<LogoutIcon />}
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    component={NavLink}
                    to="/login"
                    startIcon={<LoginIcon />}
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={NavLink}
                    to="/register"
                    startIcon={<RegisterIcon />}
                    color="inherit"
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    Register
                  </Button>
                </>
              )}
              <IconButton onClick={toggle} sx={{ borderRadius: 2 }}>
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Container component="footer" sx={{ py: 3 }}>
        <GlassCard>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">© {new Date().getFullYear()} ShuttleNow</Typography>
            <Stack direction="row" spacing={2}>
              <Button component={NavLink} to="/privacy" size="small">
                Privacy
              </Button>
              <Button component={NavLink} to="/terms" size="small">
                Terms
              </Button>
            </Stack>
          </Stack>
        </GlassCard>
      </Container>
    </Box>
  );
}
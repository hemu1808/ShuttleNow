import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useColorMode } from '../contexts/ThemeProvider';

const RegisterPage = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const { mode } = useColorMode();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      auth?.login(res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 96px)',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 4
      }}
    >
      <GlassCard sx={{ width: '100%', maxWidth: 440, p: { xs: 4, md: 5 } }}>
        <Typography variant="h4" fontWeight={900} gutterBottom sx={{
          background: mode === 'light' ? 'linear-gradient(45deg, #2563eb, #3b82f6)' : 'linear-gradient(45deg, #2dd4bf, #0ea5e9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: -1,
          textAlign: 'center',
          mb: 1
        }}>
          Start Your Journey
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Create a ShuttleNow account to manage your rides.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Full Name"
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
              fullWidth
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                  '&.Mui-focused': { bgcolor: mode === 'light' ? '#fff' : 'rgba(0,0,0,0.5)' }
                }
              }}
            />

            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  bgcolor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                  '&.Mui-focused': {
                    bgcolor: mode === 'light' ? '#fff' : 'rgba(0,0,0,0.5)'
                  }
                }
              }}
            />

            <TextField
              label="Phone Number (Optional)"
              type="tel"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              fullWidth
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                  '&.Mui-focused': { bgcolor: mode === 'light' ? '#fff' : 'rgba(0,0,0,0.5)' }
                }
              }}
            />

            <TextField
              label="Password (min. 6 chars)"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwd(!showPwd)}
                      edge="end"
                      size="small"
                    >
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  bgcolor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                  '&.Mui-focused': {
                    bgcolor: mode === 'light' ? '#fff' : 'rgba(0,0,0,0.5)'
                  }
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                borderRadius: 3,
                py: 1.5,
                fontWeight: 800,
                fontSize: '1.1rem',
                backgroundImage: mode === 'light' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                boxShadow: mode === 'light' ? '0 8px 20px rgba(59, 130, 246, 0.4)' : '0 8px 20px rgba(45, 212, 191, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: mode === 'light' ? '0 12px 24px rgba(59, 130, 246, 0.5)' : '0 12px 24px rgba(45, 212, 191, 0.5)',
                }
              }}
            >
              {loading ? <CircularProgress size={28} color="inherit" /> : 'Create Account'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
          Already have an account?{' '}
          <Box component={Link} to="/login" sx={{ color: mode === 'light' ? '#2563eb' : '#2dd4bf', fontWeight: 800, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Log in here
          </Box>
        </Typography>
      </GlassCard>
    </Box>
  );
};

export default RegisterPage;
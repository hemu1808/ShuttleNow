import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api';
import { useAuth } from './AuthContext';
import GlassCard from './GlassCard';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegisterPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { email, password });
      auth?.login(res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An unknown error occurred during registration.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 160px)',
        display: 'grid',
        placeItems: 'center',
        px: 2,
      }}
    >
      <GlassCard sx={{ width: '100%', maxWidth: 440, p: 4 }}>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Create Your Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sign up to get started with ShuttleNow.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.2}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password (min. 6 characters)"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPwd((s) => !s)}
                      edge="end"
                      size="small"
                    >
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" size="large">
              Create Account
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account?{' '}
          <Box component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Login
          </Box>
        </Typography>
      </GlassCard>
    </Box>
  );
};

export default RegisterPage;
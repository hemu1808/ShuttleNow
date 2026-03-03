import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  Alert,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from '../utils/api';
import { useColorMode } from '../contexts/ThemeProvider';


const AdminLoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { mode } = useColorMode();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError('Invalid username or password.');
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
          Admin Portal
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Secure access for authorized personnel.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" />
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
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
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
              sx={{
                mt: 2,
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
              Secure Login
            </Button>
          </Stack>
        </Box>
      </GlassCard>
    </Box>
  );
};
export default AdminLoginPage;
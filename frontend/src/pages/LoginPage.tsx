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
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showPwd, setShowPwd] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            auth?.login(res.data.token);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 80px)',
                display: 'grid',
                placeItems: 'center',
                px: 2,
            }}
        >
            <GlassCard sx={{ width: '100%', maxWidth: 440, p: 4, zIndex: 10 }}>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                    Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Login to book your next shuttle ride.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2.5}>
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
                            label="Password"
                            type={showPwd ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            autoComplete="current-password"
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

                        <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
                            Login
                        </Button>
                    </Stack>
                </Box>

                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                    Don&apos;t have an account?{' '}
                    <Box component={Link} to="/register" sx={{ color: 'primary.main', fontWeight: 600 }}>
                        Sign Up
                    </Box>
                </Typography>
            </GlassCard>
        </Box>
    );
};

export default LoginPage;

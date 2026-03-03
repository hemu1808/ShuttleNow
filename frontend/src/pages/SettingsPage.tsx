import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Switch,
  Divider,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import GlassCard from '../components/GlassCard';
import { useColorMode } from '../contexts/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';

interface User {
  name: string;
  email: string;
  phone?: string;
}

export default function SettingsPage() {
  const { mode, toggle } = useColorMode();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<User>('/auth/me');
        setUser(res.data);
        setFormData({ name: res.data.name, email: res.data.email, phone: res.data.phone || '' });
      } catch (err) {
        console.error("Failed to fetch user settings", err);
      }
    };
    if (authUser) fetchUser();
  }, [authUser]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setProfileMessage(null);
    try {
      const res = await api.put<User>('/auth/profile', formData);
      setUser(res.data);
      setIsEditingProfile(false);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    setIsEditingProfile(false);
    setProfileMessage(null);
  };

  const handleUpdatePassword = async () => {
    setIsSavingPassword(true);
    setPasswordMessage(null);
    try {
      const res = await api.put('/auth/password', passwordData);
      setPasswordMessage({ type: 'success', text: res.data.message });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, minHeight: 'calc(100vh - 96px)', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <Typography variant="h3" fontWeight={900} sx={{
          background: mode === 'light' ? 'linear-gradient(45deg, #2563eb, #3b82f6)' : 'linear-gradient(45deg, #2dd4bf, #0ea5e9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: -1,
          mb: 4
        }}>
          Account Settings
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <GlassCard sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h5" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonOutlineIcon color="primary" /> Profile Information
              </Typography>
              <Divider sx={{ opacity: 0.5 }} />

              {profileMessage && (
                <Alert severity={profileMessage.type} sx={{ borderRadius: 2 }}>{profileMessage.text}</Alert>
              )}

              <TextField
                label="Full Name"
                value={isEditingProfile ? formData.name : user?.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditingProfile}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonOutlineIcon fontSize="small" /></InputAdornment>,
                  sx: { borderRadius: 3, bgcolor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' }
                }}
              />
              <TextField
                label="Email Address"
                value={isEditingProfile ? formData.email : user?.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditingProfile}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" /></InputAdornment>,
                  sx: { borderRadius: 3, bgcolor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' }
                }}
              />
              <TextField
                label="Phone Number"
                value={isEditingProfile ? formData.phone : user?.phone || 'Not provided'}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditingProfile}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhoneIphoneIcon fontSize="small" /></InputAdornment>,
                  sx: { borderRadius: 3, bgcolor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 2 }}>
                {isEditingProfile ? (
                  <>
                    <Button variant="outlined" color="inherit" onClick={handleCancelEdit} sx={{ borderRadius: 3, fontWeight: 700 }} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSaveProfile} disabled={isSaving} sx={{
                      borderRadius: 3, fontWeight: 700,
                      backgroundImage: mode === 'light' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                    }}>
                      {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button variant="outlined" onClick={() => setIsEditingProfile(true)} sx={{ borderRadius: 3, fontWeight: 700 }}>
                    Edit Profile
                  </Button>
                )}
              </Box>
            </GlassCard>

            <GlassCard sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
              <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Change Password
              </Typography>
              <Divider sx={{ opacity: 0.5 }} />

              {passwordMessage && (
                <Alert severity={passwordMessage.type} sx={{ borderRadius: 2 }}>{passwordMessage.text}</Alert>
              )}

              <TextField
                type="password"
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                fullWidth
                InputProps={{ sx: { borderRadius: 3, bgcolor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' } }}
              />
              <TextField
                type="password"
                label="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                fullWidth
                InputProps={{ sx: { borderRadius: 3, bgcolor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' } }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button variant="contained" onClick={handleUpdatePassword} disabled={isSavingPassword || !passwordData.currentPassword || !passwordData.newPassword} sx={{
                  borderRadius: 3, fontWeight: 700,
                  backgroundImage: mode === 'light' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                }}>
                  {isSavingPassword ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
                </Button>
              </Box>
            </GlassCard>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={4}>
              <GlassCard sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Appearance
                </Typography>
                <Divider sx={{ opacity: 0.5 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {mode === 'light' ? <LightModeIcon color="primary" /> : <DarkModeIcon sx={{ color: '#2dd4bf' }} />}
                    <Box>
                      <Typography fontWeight={700}>Theme Mode</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {mode === 'light' ? 'Light Theme Active' : 'Dark Theme Active'}
                      </Typography>
                    </Box>
                  </Stack>
                  <Switch checked={mode === 'dark'} onChange={toggle} color="primary" />
                </Stack>
              </GlassCard>

              <GlassCard sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Preferences
                </Typography>
                <Divider sx={{ opacity: 0.5 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <NotificationsActiveIcon color="primary" />
                    <Box>
                      <Typography fontWeight={700} color="text.secondary">Email Alerts (Coming Soon)</Typography>
                      <Typography variant="caption" color="text.disabled">
                        Automatic PDF receipts
                      </Typography>
                    </Box>
                  </Stack>
                  <Switch disabled color="primary" />
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PhoneIphoneIcon color="primary" />
                    <Box>
                      <Typography fontWeight={700}>SMS Updates</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Arrival notifications
                      </Typography>
                    </Box>
                  </Stack>
                  <Switch defaultChecked color="primary" />
                </Stack>
              </GlassCard>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
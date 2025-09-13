import React from 'react';
import { Paper, PaperProps, styled } from '@mui/material';

const Styled = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(135deg,rgba(255,255,255,0.25),rgba(13,71,161,0.08))'
      : 'linear-gradient(135deg,rgba(15,23,42,0.25),rgba(0,105,92,0.12))',
  border: `1px solid ${
    theme.palette.mode === 'light' ? 'rgba(255,255,255,0.3)' : 'rgba(0,105,92,0.25)'
  }`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 8px 32px rgba(13,71,161,0.12)'
      : '0px 8px 32px rgba(0,105,92,0.15)',
  transition: 'all .3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow:
      theme.palette.mode === 'light'
        ? '0px 16px 40px rgba(13,71,161,0.16)'
        : '0px 16px 40px rgba(0,105,92,0.20)',
  },
}));

export default function GlassCard(props: PaperProps) {
  return <Styled elevation={0} {...props} />;
}

import React from 'react';
import { Paper, PaperProps, styled } from '@mui/material';

const Styled = styled(Paper)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(2),
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    backgroundColor:
        theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.45)'
            : 'rgba(17, 25, 40, 0.45)',
    border: theme.palette.mode === 'light'
        ? '1px solid rgba(255, 255, 255, 0.8)'
        : '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow:
        theme.palette.mode === 'light'
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.05), inset 0 0 0 1px rgba(255,255,255,0.4)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
    overflow: 'hidden',
    transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-150%',
        width: '100%',
        height: '100%',
        background: theme.palette.mode === 'light'
            ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)'
            : 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)',
        transform: 'skewX(-25deg)',
        transition: 'all 0.7s ease',
        zIndex: 0,
        pointerEvents: 'none',
    },
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow:
            theme.palette.mode === 'light'
                ? '0 12px 24px 0 rgba(31, 38, 135, 0.08), inset 0 0 0 1px rgba(255,255,255,0.8)'
                : '0 12px 30px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255,255,255,0.2)',
        backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.6)'
            : 'rgba(17, 25, 40, 0.65)',
        '&::before': {
            left: '200%',
        }
    },
    '& > *': {
        position: 'relative',
        zIndex: 1,
    }
}));

export default function GlassCard({ sx, ...props }: PaperProps) {
    return <Styled elevation={0} sx={sx} {...props} />;
}

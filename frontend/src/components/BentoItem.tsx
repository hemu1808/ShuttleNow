import React from 'react';
import { Box, Paper, PaperProps, styled } from '@mui/material';

interface BentoItemProps extends PaperProps {
  children: React.ReactNode;
  span?: number;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

const StyledBentoItem = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  background:
    theme.palette.mode === 'light'
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(30, 30, 30, 0.7)',
  border: `1px solid ${
    theme.palette.mode === 'light'
      ? 'rgba(255, 255, 255, 0.18)'
      : 'rgba(255, 255, 255, 0.18)'
  }`,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    background:
      theme.palette.mode === 'light'
        ? 'rgba(255, 255, 255, 0.85)'
        : 'rgba(40, 40, 40, 0.85)',
  },
}));

const BentoItem: React.FC<BentoItemProps> = ({
  children,
  span = 1,
  icon,
  title,
  description,
  sx,
  ...props
}) => {
  return (
    <StyledBentoItem
      sx={{
        gridColumn: `span ${span}`,
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...sx,
      }}
      {...props}
    >
      {icon && (
        <Box sx={{ mb: 2, fontSize: '2.5rem', color: 'primary.main' }}>
          {icon}
        </Box>
      )}
      {title && (
        <Box sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 1 }}>
          {title}
        </Box>
      )}
      {description && (
        <Box sx={{ fontSize: '0.9rem', opacity: 0.7, mb: 2 }}>
          {description}
        </Box>
      )}
      {children}
    </StyledBentoItem>
  );
};

export default BentoItem;
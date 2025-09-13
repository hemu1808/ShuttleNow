import React from 'react';
import { Box, Fade } from '@mui/material';
import { useLocation } from 'react-router-dom';

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  return (
    <Fade in timeout={400} key={location.pathname}>
      <Box>{children}</Box>
    </Fade>
  );
}

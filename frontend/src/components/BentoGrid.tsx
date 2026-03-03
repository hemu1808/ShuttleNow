import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface BentoGridProps extends BoxProps {
  children: React.ReactNode;
  columns?: number | { xs: number; sm: number; md: number };
  gap?: number;
}

const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  columns = 3,
  gap = 2,
  sx,
  ...props
}) => {
  const getGridColumns = () => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    return {
      xs: `repeat(${columns.xs}, 1fr)`,
      sm: `repeat(${columns.sm}, 1fr)`,
      md: `repeat(${columns.md}, 1fr)`,
    };
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(),
        gap: gap,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default BentoGrid;
import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import BentoGrid from '../components/BentoGrid';
import BentoItem from '../components/BentoItem';
import {
  AirportShuttle as ShuttleIcon,
  Map as MapIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  LocalOffer as OffersIcon,
} from '@mui/icons-material';

// Hero section with bento layout
export const HeroSection = () => {
  return (
    <Box sx={{ py: 6, mb: 4 }}>
      <Container>
        <Typography
          variant="h2"
          sx={{
            mb: 2,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Your Journey Starts Here
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.7 }}>
          Book your shuttle ride in just a few clicks
        </Typography>
      </Container>
    </Box>
  );
};

// Features section with bento grid
export const FeaturesSection = () => {
  const features = [
    {
      title: 'Real-time Tracking',
      description: 'Track your shuttle in real-time with live GPS updates',
      icon: <MapIcon />,
      span: 1,
    },
    {
      title: 'Easy Booking',
      description: 'Book your seats with our simple and intuitive interface',
      icon: <ShuttleIcon />,
      span: 1,
    },
    {
      title: 'Scheduled Rides',
      description: 'Check available schedules and pick your preferred time',
      icon: <ScheduleIcon />,
      span: 1,
    },
    {
      title: 'Secure Payments',
      description: 'Multiple payment options with secure transactions',
      icon: <PaymentIcon />,
      span: 2,
    },
    {
      title: 'Special Offers',
      description: 'Get exclusive deals and discounts on every booking',
      icon: <OffersIcon />,
      span: 1,
    },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Container>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
          Why Choose ShuttleNow?
        </Typography>
        <BentoGrid columns={{ xs: 1, sm: 2, md: 3 }} gap={3}>
          {features.map((feature, idx) => (
            <BentoItem
              key={idx}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              span={feature.span}
            >
              <Button variant="outlined" size="small" sx={{ mt: 'auto' }}>
                Learn More
              </Button>
            </BentoItem>
          ))}
        </BentoGrid>
      </Container>
    </Box>
  );
};

// Stats section with bento layout
export const StatsSection = () => {
  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Rides Completed', value: '100K+' },
    { label: 'Cities Covered', value: '25+' },
    { label: 'Avg Rating', value: '4.8⭐' },
  ];

  return (
    <Box sx={{ py: 6, mb: 4 }}>
      <Container>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
          By The Numbers
        </Typography>
        <BentoGrid columns={{ xs: 2, sm: 2, md: 4 }} gap={2}>
          {stats.map((stat, idx) => (
            <BentoItem key={idx} span={1}>
              <Stack sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                  {stat.label}
                </Typography>
              </Stack>
            </BentoItem>
          ))}
        </BentoGrid>
      </Container>
    </Box>
  );
};
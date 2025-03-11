'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import SupabaseLoginForm from '@/components/Auth/SupabaseLoginForm';
import { UserProvider } from '@/contexts/SupabaseUserContext';

export default function AuthPage() {
  return (
    <UserProvider>
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login or Register
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Secure authentication for your SEO Projects
          </Typography>
        </Box>
        <SupabaseLoginForm />
      </Container>
    </UserProvider>
  );
}

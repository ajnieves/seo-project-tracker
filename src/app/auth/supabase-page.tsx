'use client';

import React, { useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import SupabaseLoginForm from '@/components/Auth/SupabaseLoginForm';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const { user } = useUser();
  const router = useRouter();

  // Redirect logged-in users to the dashboard
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // If user is logged in, show loading while redirecting
  if (user) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          You are already logged in. Redirecting to dashboard...
        </Typography>
      </Container>
    );
  }

  // Otherwise show the login form
  return (
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
  );
}

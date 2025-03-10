'use client';

import React from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import LoginForm from '@/components/Auth/LoginForm';
import UserProfile from '@/components/Auth/UserProfile';
import { useUser } from '@/contexts/UserContext';

export default function AuthPage() {
  const { user, loading } = useUser();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {user ? 'Your Profile' : 'Login or Register'}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : user ? (
          <UserProfile />
        ) : (
          <LoginForm />
        )}
      </Box>
    </Container>
  );
}

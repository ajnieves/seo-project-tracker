'use client';

import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  Paper,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const { resetPassword } = useUser();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const success = await resetPassword(email);
      
      if (success) {
        setResetSent(true);
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Reset Password
      </Typography>
      
      {resetSent ? (
        <Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            Password reset request processed successfully!
          </Alert>
          <Typography paragraph>
            <strong>Note:</strong> In this demo version, no actual email is sent. To test the password reset flow, 
            you can use the following link:
          </Typography>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'background.paper', 
            borderRadius: 1, 
            mb: 2,
            wordBreak: 'break-all',
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center'
          }}>
            <Button
              component={Link}
              href="/auth/reset-password/confirm?token=demo-token"
              variant="contained"
              color="primary"
              sx={{ mb: 1 }}
            >
              Use Demo Reset Link
            </Button>
            <Typography component="div" variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              <code>/auth/reset-password/confirm?token=demo-token</code>
            </Typography>
          </Box>
          <Typography paragraph>
            In a production environment, a real email would be sent with a secure reset link.
          </Typography>
          <Button 
            component={Link} 
            href="/auth" 
            variant="outlined" 
            fullWidth
            sx={{ mt: 2 }}
          >
            Back to Login
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography paragraph>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <MuiLink component={Link} href="/auth" variant="body2">
              Back to Login
            </MuiLink>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

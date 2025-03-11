import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Alert,
  CircularProgress
} from '@mui/material';
import Link from 'next/link';

export const metadata = {
  title: 'Confirm Password Reset | SEO Projects Tracker',
  description: 'Confirm your password reset for the SEO Projects Tracker application',
};

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Get token from URL
  const token = searchParams?.get('token');
  
  // Check if token exists
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please try requesting a new password reset.');
    } else if (token === 'demo-token') {
      // For demo purposes, we accept a special token
      console.log('Using demo token for password reset');
    }
  }, [token]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid or missing reset token. Please try requesting a new password reset.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Call Supabase API to reset password
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server: 'supabase-mcp-server',
          tool: 'confirmResetPassword',
          args: {
            token,
            newPassword
          }
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
        // Clear form
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          SEO Projects Tracker
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Reset Your Password
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Your password has been successfully reset!
              </Alert>
              <Typography paragraph>
                You can now log in with your new password.
              </Typography>
              <Button 
                component={Link} 
                href="/auth" 
                variant="contained" 
                fullWidth
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography paragraph>
                Please enter your new password below.
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading || !token}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || !token}
                error={newPassword !== confirmPassword && confirmPassword !== ''}
                helperText={
                  newPassword !== confirmPassword && confirmPassword !== ''
                    ? 'Passwords do not match'
                    : ''
                }
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !token}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  component={Link} 
                  href="/auth" 
                  variant="text"
                >
                  Back to Login
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

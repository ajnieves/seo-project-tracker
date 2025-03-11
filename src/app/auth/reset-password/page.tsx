import ResetPasswordForm from '@/components/Auth/ResetPasswordForm';
import { Box, Container, Typography } from '@mui/material';

export const metadata = {
  title: 'Reset Password | SEO Projects Tracker',
  description: 'Reset your password for the SEO Projects Tracker application',
};

export default function ResetPasswordPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          SEO Projects Tracker
        </Typography>
        <ResetPasswordForm />
      </Box>
    </Container>
  );
}

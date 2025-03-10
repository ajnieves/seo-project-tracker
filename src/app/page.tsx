import { Box, Divider } from '@mui/material';
import Dashboard from '@/components/Dashboard';
import ProjectsSection from '@/components/ProjectsSection';

export default function Home() {
  return (
    <Box>
      {/* Dashboard Section */}
      <Dashboard />
      
      <Divider sx={{ my: 4 }} />
      
      {/* Projects Section */}
      <ProjectsSection />
    </Box>
  );
}

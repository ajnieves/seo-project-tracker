'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  IconButton,
  Alert,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TaskList from '@/components/TaskList';

// Mock data for projects
const mockProjects = [
  {
    id: '1',
    name: 'Website Optimization',
    description: 'Improve website performance and SEO ranking',
    createdAt: new Date('2025-02-15').toISOString()
  },
  {
    id: '2',
    name: 'Content Strategy',
    description: 'Develop content strategy for Q2',
    createdAt: new Date('2025-03-01').toISOString()
  },
  {
    id: '3',
    name: 'Keyword Research',
    description: 'Research and identify high-value keywords for our industry',
    createdAt: new Date('2025-03-05').toISOString()
  }
];

export default function ProjectDetailContent() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  // State for projects
  const [projects, setProjects] = useState<any[]>(mockProjects);
  const [project, setProject] = useState<any>(null);
  
  // Load project from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load projects
      const storedProjects = localStorage.getItem('seoProjects');
      if (storedProjects) {
        try {
          const parsedProjects = JSON.parse(storedProjects);
          setProjects(parsedProjects);
          const foundProject = parsedProjects.find((p: any) => p.id === projectId);
          setProject(foundProject);
        } catch (error) {
          console.error('Error parsing projects from localStorage:', error);
          const foundProject = mockProjects.find(p => p.id === projectId);
          setProject(foundProject);
        }
      } else {
        const foundProject = mockProjects.find(p => p.id === projectId);
        setProject(foundProject);
      }
    }
  }, [projectId]);

  // Handle back button click
  const handleBack = () => {
    router.push('/projects');
  };

  if (!project) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" color="error">Project not found</Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Project header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 3, sm: 0 },
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            wordBreak: 'break-word'
          }}>
            {project.name}
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {project.description}
      </Typography>
      
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Project Details</Typography>
        <Typography variant="body2">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </Typography>
        
        {project.tasksCount !== undefined && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Tasks: {project.completedTasks || 0}/{project.tasksCount || 0}
          </Typography>
        )}
      </Paper>
      
      {/* Task List */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <TaskList projectId={projectId} />
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ mt: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Projects
        </Button>
      </Box>
    </Box>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { generateDemoProjectWithTasks } from '@/utils/demoData';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Chip,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock data for initial projects
const initialProjects = [
  {
    id: '1',
    name: 'Website Optimization',
    description: 'Improve website performance and SEO ranking',
    tasksCount: 12,
    completedTasks: 5,
    createdAt: new Date('2025-02-15').toISOString()
  },
  {
    id: '2',
    name: 'Content Strategy',
    description: 'Develop content strategy for Q2',
    tasksCount: 8,
    completedTasks: 2,
    createdAt: new Date('2025-03-01').toISOString()
  }
];

// Type for sort order
type Order = 'asc' | 'desc';

// Type for project
type Project = {
  id: string;
  name: string;
  description: string;
  tasksCount: number;
  completedTasks: number;
  createdAt: string;
};

// Calculate completion percentage
const getCompletionPercentage = (completed: number, total: number) => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export default function ProjectsSection() {
  const router = useRouter();
  // Get user from context
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<keyof Project>('createdAt');
  const [order, setOrder] = useState<Order>('desc');
  const [openDialog, setOpenDialog] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  
  // Load projects from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProjects = localStorage.getItem('seoProjects');
      if (storedProjects) {
        try {
          const parsedProjects = JSON.parse(storedProjects);
          setProjects(parsedProjects);
        } catch (error) {
          console.error('Error parsing projects from localStorage:', error);
          setProjects([]);
        }
      } else {
        // For non-logged-in users, generate a demo project with tasks
        if (!user) {
          generateDemoProjectWithTasks();
          // Fetch the newly generated project
          const generatedProjects = localStorage.getItem('seoProjects');
          if (generatedProjects) {
            try {
              setProjects(JSON.parse(generatedProjects));
            } catch (error) {
              console.error('Error parsing generated projects:', error);
              setProjects([]);
            }
          }
        } else {
          // For logged-in users, initialize with empty projects
          localStorage.setItem('seoProjects', JSON.stringify([]));
          setProjects([]);
        }
      }
    }
  }, [user]);

  // Force refresh when user state changes
  useEffect(() => {
    // This will ensure the component re-renders when user state changes
    console.log("User state changed:", user ? "logged in" : "logged out");
  }, [user]);
  
  // Handle changing the sort order
  const handleRequestSort = (property: keyof Project) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort projects based on orderBy and order
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    
    if (orderBy === 'name' || orderBy === 'description') {
      comparison = a[orderBy].localeCompare(b[orderBy]);
    } else if (orderBy === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      // For numeric properties (tasksCount, completedTasks)
      comparison = Number(a[orderBy]) - Number(b[orderBy]);
    }
    
    return order === 'asc' ? comparison : -comparison;
  });

  const handleOpenDialog = () => {
    // Check if user is not logged in and already has 2 projects
    if (!user && projects.length >= 2) {
      // Show dialog with message that user needs to log in to create more projects
      alert('You need to log in to create more than 2 projects. Please log in or register to unlock unlimited projects.');
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewProject({ name: '', description: '' });
  };

  const handleCreateProject = () => {
    if (newProject.name.trim() === '') return;
    
    const project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      tasksCount: 0,
      completedTasks: 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    
    // Store projects in localStorage
    localStorage.setItem('seoProjects', JSON.stringify(updatedProjects));
    handleCloseDialog();
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <Box>
      {/* Free tier limitations banner */}
      {!user && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Free Account Limitations
            </Typography>
            <Typography variant="body2">
              You are currently using a free account which is limited to 2 projects and 5 tasks per project.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            component={Link}
            href="/auth"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Login or Register
          </Button>
        </Paper>
      )}

      {/* Projects Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            SEO Projects
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            New Project
          </Button>
        </Box>
        
        {projects.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' }, 
            gap: { xs: 2, sm: 0 },
            mb: 3 
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2,
              width: { xs: '100%', sm: 'auto' } 
            }}>
              <TextField
                placeholder="Search projects..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: { xs: '100%', sm: 220 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 } }}>
                <InputLabel id="sort-by-label">Sort by</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={orderBy}
                  label="Sort by"
                  onChange={(e) => handleRequestSort(e.target.value as keyof Project)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="createdAt">Date Created</MenuItem>
                  <MenuItem value="tasksCount">Number of Tasks</MenuItem>
                  <MenuItem value="completedTasks">Completed Tasks</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {order === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {projects.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your first SEO project to get started
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Create Project
          </Button>
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No matching projects found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Try adjusting your search criteria
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => handleProjectClick(project.id)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip 
                      label={`${project.completedTasks}/${project.tasksCount} tasks`} 
                      size="small" 
                      color={project.completedTasks === project.tasksCount && project.tasksCount > 0 ? "success" : "default"}
                    />
                    <Chip 
                      label={`Created: ${new Date(project.createdAt).toLocaleDateString()}`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Project Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            variant="outlined"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateProject} 
            variant="contained" 
            disabled={!newProject.name.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Chip, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useRouter } from 'next/navigation';

// Mock data for projects
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
  },
  {
    id: '3',
    name: 'Keyword Research',
    description: 'Research and identify high-value keywords for our industry',
    tasksCount: 5,
    completedTasks: 0,
    createdAt: new Date('2025-03-05').toISOString()
  },
  {
    id: '4',
    name: 'Backlink Building',
    description: 'Develop and implement a strategy to increase quality backlinks',
    tasksCount: 7,
    completedTasks: 3,
    createdAt: new Date('2025-02-20').toISOString()
  }
];

// Type for project
type Project = {
  id: string;
  name: string;
  description: string;
  tasksCount: number;
  completedTasks: number;
  createdAt: string;
};

// Type for sort order
type Order = 'asc' | 'desc';

export default function ProjectsPageContent() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [orderBy, setOrderBy] = useState<keyof Project>('createdAt');
  const [order, setOrder] = useState<Order>('desc');
  
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
        }
      } else {
        // Initialize localStorage with default projects if it doesn't exist
        localStorage.setItem('seoProjects', JSON.stringify(initialProjects));
      }
    }
  }, []);

  // Handle opening the create project dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Handle closing the create project dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewProject({ name: '', description: '' });
  };

  // Handle creating a new project
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

  // Handle clicking on a project to view details
  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

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

  // Calculate completion percentage
  const getCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 5 
      }}>
        <Typography variant="h4" component="h1">
          All Projects
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          fullWidth={false}
          sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
        >
          New Project
        </Button>
      </Box>
      
      {/* Search and Filter Bar */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        gap: 2,
        mb: 3 
      }}>
        <TextField
          placeholder="Search projects..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
          <Tooltip title="List view">
            <IconButton 
              color={viewMode === 'list' ? 'primary' : 'default'} 
              onClick={() => setViewMode('list')}
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Grid view">
            <IconButton 
              color={viewMode === 'grid' ? 'primary' : 'default'} 
              onClick={() => setViewMode('grid')}
            >
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {sortedProjects.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {searchTerm ? 'Try a different search term' : 'Create your first SEO project to get started'}
          </Typography>
          {!searchTerm && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Create Project
            </Button>
          )}
        </Paper>
      ) : viewMode === 'grid' ? (
        // Grid View
        <Grid container spacing={4}>
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
                      label={`${getCompletionPercentage(project.completedTasks, project.tasksCount)}%`} 
                      size="small" 
                      color="primary"
                    />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // List View
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer component={Paper} sx={{ minWidth: { xs: '100%', md: 650 } }}>
            <Table aria-label="projects table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Project Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'description'}
                      direction={orderBy === 'description' ? order : 'asc'}
                      onClick={() => handleRequestSort('description')}
                    >
                      Description
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'tasksCount'}
                      direction={orderBy === 'tasksCount' ? order : 'asc'}
                      onClick={() => handleRequestSort('tasksCount')}
                    >
                      Tasks
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'completedTasks'}
                      direction={orderBy === 'completedTasks' ? order : 'asc'}
                      onClick={() => handleRequestSort('completedTasks')}
                    >
                      Completed
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'createdAt'}
                      direction={orderBy === 'createdAt' ? order : 'asc'}
                      onClick={() => handleRequestSort('createdAt')}
                    >
                      Created
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    hover
                    onClick={() => handleProjectClick(project.id)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="subtitle2">{project.name}</Typography>
                    </TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${project.completedTasks}/${project.tasksCount}`} 
                        size="small" 
                        color={project.completedTasks === project.tasksCount && project.tasksCount > 0 ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${getCompletionPercentage(project.completedTasks, project.tasksCount)}%`} 
                        size="small" 
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
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

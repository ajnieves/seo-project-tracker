'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  Checkbox, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { dataService, Project } from '@/services/dataService';

export default function ProjectBulkActions() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Load projects from dataService
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedProjects = dataService.getProjects();
      setProjects(loadedProjects);
    }
  }, []);
  
  // Handle selecting/deselecting a project
  const handleToggleProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };
  
  // Handle selecting/deselecting all projects
  const handleToggleAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(project => project.id));
    }
  };
  
  // Handle deleting selected projects
  const handleDeleteProjects = () => {
    try {
      dataService.deleteProjects(selectedProjects);
      
      // Update local state
      setProjects(prev => prev.filter(project => !selectedProjects.includes(project.id)));
      setSelectedProjects([]);
      
      setSnackbar({
        open: true,
        message: `Successfully deleted ${selectedProjects.length} project(s)`,
        severity: 'success'
      });
      
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error deleting projects:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting projects',
        severity: 'error'
      });
    }
  };
  
  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>Bulk Project Management</Typography>
      <Divider sx={{ mb: 3 }} />
      
      {projects.length === 0 ? (
        <Alert severity="info">No projects available</Alert>
      ) : (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={selectedProjects.length === projects.length && projects.length > 0}
                indeterminate={selectedProjects.length > 0 && selectedProjects.length < projects.length}
                onChange={handleToggleAll}
              />
              <Typography>
                {selectedProjects.length} of {projects.length} selected
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={selectedProjects.length === 0}
              onClick={() => setConfirmDialogOpen(true)}
            >
              Delete Selected
            </Button>
          </Box>
          
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {projects.map((project) => (
              <ListItem
                key={project.id}
                divider
                secondaryAction={
                  <Chip 
                    label={`${project.completedTasks}/${project.tasksCount} tasks`} 
                    size="small" 
                    color={project.completedTasks === project.tasksCount && project.tasksCount > 0 ? "success" : "default"}
                  />
                }
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => handleToggleProject(project.id)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={project.name}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {project.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
      
      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedProjects.length} selected project(s)? 
            This will also delete all tasks and documents associated with these projects. 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProjects} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

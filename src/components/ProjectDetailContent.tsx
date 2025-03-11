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
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LaunchIcon from '@mui/icons-material/Launch';
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

// Type for attachment
type Attachment = {
  id: string;
  name: string;
  url: string;
  type: 'link' | 'file';
  createdAt: string;
};

export default function ProjectDetailContent() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  // State for projects
  const [projects, setProjects] = useState<any[]>(mockProjects);
  const [project, setProject] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedProject, setEditedProject] = useState<{name: string, description: string}>({
    name: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // State for attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [newAttachment, setNewAttachment] = useState<{name: string, url: string, type: 'link' | 'file'}>({
    name: '',
    url: '',
    type: 'link'
  });
  
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
          
          if (foundProject) {
            setEditedProject({
              name: foundProject.name,
              description: foundProject.description
            });
            
            // Load attachments
            if (foundProject.attachments) {
              setAttachments(foundProject.attachments);
            }
          }
        } catch (error) {
          console.error('Error parsing projects from localStorage:', error);
          const foundProject = mockProjects.find(p => p.id === projectId);
          setProject(foundProject);
          
          if (foundProject) {
            setEditedProject({
              name: foundProject.name,
              description: foundProject.description
            });
          }
        }
      } else {
        const foundProject = mockProjects.find(p => p.id === projectId);
        setProject(foundProject);
        
        if (foundProject) {
          setEditedProject({
            name: foundProject.name,
            description: foundProject.description
          });
        }
      }
    }
  }, [projectId]);

  // Handle back button click
  const handleBack = () => {
    router.push('/projects');
  };
  
  // Handle opening the edit dialog
  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };
  
  // Handle closing the edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };
  
  // Handle saving the edited project
  const handleSaveProject = () => {
    if (!editedProject.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Project name cannot be empty',
        severity: 'error'
      });
      return;
    }
    
    // Update the project in state
    const updatedProject = {
      ...project,
      name: editedProject.name,
      description: editedProject.description
    };
    setProject(updatedProject);
    
    // Update the project in the projects array
    const updatedProjects = projects.map(p => 
      p.id === projectId ? updatedProject : p
    );
    setProjects(updatedProjects);
    
    // Save to localStorage
    localStorage.setItem('seoProjects', JSON.stringify(updatedProjects));
    
    // Close the dialog and show success message
    setEditDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Project updated successfully',
      severity: 'success'
    });
  };
  
  // Handle opening the attachment dialog
  const handleOpenAttachmentDialog = () => {
    setAttachmentDialogOpen(true);
  };
  
  // Handle closing the attachment dialog
  const handleCloseAttachmentDialog = () => {
    setAttachmentDialogOpen(false);
    setNewAttachment({
      name: '',
      url: '',
      type: 'link'
    });
  };
  
  // Handle adding a new attachment
  const handleAddAttachment = () => {
    if (!newAttachment.name.trim() || !newAttachment.url.trim()) {
      setSnackbar({
        open: true,
        message: 'Name and URL are required',
        severity: 'error'
      });
      return;
    }
    
    // Create new attachment
    const attachment: Attachment = {
      id: Date.now().toString(),
      name: newAttachment.name,
      url: newAttachment.url,
      type: newAttachment.type,
      createdAt: new Date().toISOString()
    };
    
    // Add to attachments
    const updatedAttachments = [...attachments, attachment];
    setAttachments(updatedAttachments);
    
    // Update project with attachments
    const updatedProject = {
      ...project,
      attachments: updatedAttachments
    };
    setProject(updatedProject);
    
    // Update projects array
    const updatedProjects = projects.map(p => 
      p.id === projectId ? updatedProject : p
    );
    setProjects(updatedProjects);
    
    // Save to localStorage
    localStorage.setItem('seoProjects', JSON.stringify(updatedProjects));
    
    // Close dialog and show success message
    handleCloseAttachmentDialog();
    setSnackbar({
      open: true,
      message: 'Attachment added successfully',
      severity: 'success'
    });
  };
  
  // Handle deleting an attachment
  const handleDeleteAttachment = (attachmentId: string) => {
    // Filter out the attachment
    const updatedAttachments = attachments.filter(a => a.id !== attachmentId);
    setAttachments(updatedAttachments);
    
    // Update project with attachments
    const updatedProject = {
      ...project,
      attachments: updatedAttachments
    };
    setProject(updatedProject);
    
    // Update projects array
    const updatedProjects = projects.map(p => 
      p.id === projectId ? updatedProject : p
    );
    setProjects(updatedProjects);
    
    // Save to localStorage
    localStorage.setItem('seoProjects', JSON.stringify(updatedProjects));
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Attachment deleted successfully',
      severity: 'success'
    });
  };
  
  // Handle opening an attachment
  const handleOpenAttachment = (url: string) => {
    window.open(url, '_blank');
  };
  
  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
          <IconButton 
            onClick={handleOpenEditDialog} 
            sx={{ ml: 1 }}
            aria-label="edit project"
          >
            <EditIcon />
          </IconButton>
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
      
      {/* Attachments Section */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Attachments & Links</Typography>
          <Button 
            startIcon={<AddIcon />} 
            onClick={handleOpenAttachmentDialog}
            size="small"
          >
            Add
          </Button>
        </Box>
        
        {attachments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No attachments or links yet. Add some to keep track of important resources.
          </Typography>
        ) : (
          <List>
            {attachments.map((attachment) => (
              <ListItem key={attachment.id} divider>
                <ListItemIcon>
                  {attachment.type === 'link' ? <LinkIcon /> : <AttachFileIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary={attachment.name}
                  secondary={`Added: ${new Date(attachment.createdAt).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Open">
                    <IconButton 
                      edge="end" 
                      aria-label="open" 
                      onClick={() => handleOpenAttachment(attachment.url)}
                      sx={{ mr: 1 }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleDeleteAttachment(attachment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
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
      
      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            variant="outlined"
            value={editedProject.name}
            onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editedProject.description}
            onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveProject} 
            variant="contained" 
            disabled={!editedProject.name.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Attachment Dialog */}
      <Dialog open={attachmentDialogOpen} onClose={handleCloseAttachmentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Attachment or Link</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Type</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                icon={<LinkIcon />} 
                label="Link" 
                clickable
                color={newAttachment.type === 'link' ? 'primary' : 'default'}
                onClick={() => setNewAttachment({ ...newAttachment, type: 'link' })}
              />
              <Chip 
                icon={<AttachFileIcon />} 
                label="File URL" 
                clickable
                color={newAttachment.type === 'file' ? 'primary' : 'default'}
                onClick={() => setNewAttachment({ ...newAttachment, type: 'file' })}
              />
            </Box>
          </Box>
          
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={newAttachment.name}
            onChange={(e) => setNewAttachment({ ...newAttachment, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label={newAttachment.type === 'link' ? 'URL' : 'File URL'}
            fullWidth
            variant="outlined"
            value={newAttachment.url}
            onChange={(e) => setNewAttachment({ ...newAttachment, url: e.target.value })}
            placeholder={newAttachment.type === 'link' ? 'https://example.com' : 'https://example.com/file.pdf'}
            helperText={
              newAttachment.type === 'link' 
                ? 'Enter the URL of the website or resource' 
                : 'Enter the URL where the file is hosted'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAttachmentDialog}>Cancel</Button>
          <Button 
            onClick={handleAddAttachment} 
            variant="contained" 
            disabled={!newAttachment.name.trim() || !newAttachment.url.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      {snackbar.open && (
        <Alert 
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16,
            zIndex: 2000,
            boxShadow: 3
          }}
        >
          {snackbar.message}
        </Alert>
      )}
    </Box>
  );
}

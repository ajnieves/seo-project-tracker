'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider
} from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { dataService } from '@/services/dataService';

// Get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'info';
    case 'blocked':
      return 'error';
    default:
      return 'default';
  }
};

export default function TaskList({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'in-queue',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dependencies: [] as string[]
  });
  
  // Load tasks from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const projectTasks = dataService.getProjectTasks(projectId);
      setTasks(projectTasks);
    }
  }, [projectId]);
  
  // Get user from context
  const { user } = useUser();

  // Handle opening the dialog for a new task
  const handleOpenDialog = () => {
    // Check if user is not logged in and already has 5 tasks
    if (!user && tasks.length >= 5) {
      // Show dialog with message that user needs to log in to create more tasks
      alert('You need to log in to create more than 5 tasks per project. Please log in or register to unlock unlimited tasks.');
      return;
    }

    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'in-queue',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dependencies: []
    });
    setOpenDialog(true);
  };
  
  // Handle opening the dialog for editing a task
  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      startDate: new Date(task.startDate).toISOString().split('T')[0],
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      dependencies: task.dependencies
    });
    setOpenDialog(true);
  };
  
  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle creating or updating a task
  const handleSaveTask = () => {
    if (newTask.title.trim() === '') return;
    
    const allTasks = dataService.getTasks();
    let updatedTasks;
    
    if (editingTask) {
      // Update existing task
      updatedTasks = allTasks.map(task => 
        task.id === editingTask.id 
          ? {
              ...task,
              title: newTask.title,
              description: newTask.description,
              priority: newTask.priority,
              status: newTask.status,
              startDate: new Date(newTask.startDate).toISOString(),
              dueDate: new Date(newTask.dueDate).toISOString(),
              dependencies: newTask.dependencies
            }
          : task
      );
    } else {
      // Create new task
      const newTaskObj = {
        id: Date.now().toString(),
        projectId,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        startDate: new Date(newTask.startDate).toISOString(),
        dueDate: new Date(newTask.dueDate).toISOString(),
        completed: false,
        dependencies: newTask.dependencies
      };
      
      updatedTasks = [...allTasks, newTaskObj];
    }
    
    // Save tasks to localStorage
    dataService.saveTasks(updatedTasks);
    
    // Update project task count
    const projects = dataService.getProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      const projectTasks = updatedTasks.filter(task => task.projectId === projectId);
      const completedTasks = projectTasks.filter(task => task.completed).length;
      
      const updatedProjects = projects.map(p => 
        p.id === projectId 
          ? { ...p, tasksCount: projectTasks.length, completedTasks }
          : p
      );
      
      dataService.saveProjects(updatedProjects);
    }
    
    // Update local state
    setTasks(updatedTasks.filter(task => task.projectId === projectId));
    handleCloseDialog();
  };
  
  // Handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    const allTasks = dataService.getTasks();
    const updatedTasks = allTasks.filter(task => task.id !== taskId);
    
    // Save tasks to localStorage
    dataService.saveTasks(updatedTasks);
    
    // Update project task count
    const projects = dataService.getProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      const projectTasks = updatedTasks.filter(task => task.projectId === projectId);
      const completedTasks = projectTasks.filter(task => task.completed).length;
      
      const updatedProjects = projects.map(p => 
        p.id === projectId 
          ? { ...p, tasksCount: projectTasks.length, completedTasks }
          : p
      );
      
      dataService.saveProjects(updatedProjects);
    }
    
    // Update local state
    setTasks(updatedTasks.filter(task => task.projectId === projectId));
  };
  
  // Handle toggling task completion
  const handleToggleComplete = (taskId: string) => {
    const allTasks = dataService.getTasks();
    const updatedTasks = allTasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, status: !task.completed ? 'completed' : 'in-progress' }
        : task
    );
    
    // Save tasks to localStorage
    dataService.saveTasks(updatedTasks);
    
    // Update project task count
    const projects = dataService.getProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      const projectTasks = updatedTasks.filter(task => task.projectId === projectId);
      const completedTasks = projectTasks.filter(task => task.completed).length;
      
      const updatedProjects = projects.map(p => 
        p.id === projectId 
          ? { ...p, tasksCount: projectTasks.length, completedTasks }
          : p
      );
      
      dataService.saveProjects(updatedProjects);
    }
    
    // Update local state
    setTasks(updatedTasks.filter(task => task.projectId === projectId));
  };
  
  return (
    <Box>
      {/* Free tier limitations banner */}
      {!user && tasks.length >= 3 && (
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
              You are currently using a free account which is limited to 5 tasks per project. {tasks.length}/5 tasks used.
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Tasks</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Task
        </Button>
      </Box>
      
      {tasks.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            No tasks yet. Click the button above to add your first task.
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {tasks.map((task) => (
              <ListItem key={task.id} divider>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={task.title}
                  primaryTypographyProps={{
                    style: {
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'text.secondary' : 'text.primary'
                    }
                  }}
                  secondary={
                    <>
                      <Box component="span" display="block" sx={{ mb: 1 }}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Box>
                      <Box component="span" sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} 
                          size="small" 
                          color={getPriorityColor(task.priority) as any}
                        />
                        <Chip 
                          label={task.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} 
                          size="small" 
                          color={getStatusColor(task.status) as any}
                        />
                      </Box>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEditTask(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      
      {/* Add/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newTask.status}
                label="Status"
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <MenuItem value="in-queue">In Queue</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={newTask.startDate}
              onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          
          {tasks.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Dependencies</InputLabel>
              <Select
                multiple
                value={newTask.dependencies}
                label="Dependencies"
                onChange={(e) => setNewTask({ 
                  ...newTask, 
                  dependencies: typeof e.target.value === 'string' 
                    ? e.target.value.split(',') 
                    : e.target.value 
                })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const task = tasks.find(t => t.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={task ? task.title : value} 
                          size="small" 
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {tasks
                  .filter(task => !editingTask || task.id !== editingTask.id)
                  .map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.title}
                    </MenuItem>
                  ))
                }
              </Select>
              <FormHelperText>Select tasks that must be completed before this one</FormHelperText>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveTask} 
            variant="contained" 
            disabled={!newTask.title.trim()}
          >
            {editingTask ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

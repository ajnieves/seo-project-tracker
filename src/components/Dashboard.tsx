'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { generateDemoProjectWithTasks } from '@/utils/demoData';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Chip,
  LinearProgress,
  Button
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useRouter } from 'next/navigation';

// Mock data for tasks
const mockTasks = [
  {
    id: '101',
    projectId: '1',
    title: 'Perform keyword research',
    description: 'Research and identify high-value keywords for our industry',
    priority: 'high',
    status: 'completed',
    startDate: new Date('2025-02-16').toISOString(),
    dueDate: new Date('2025-02-20').toISOString(),
    completed: true,
    dependencies: []
  },
  {
    id: '102',
    projectId: '1',
    title: 'Optimize meta tags',
    description: 'Update title tags and meta descriptions based on keyword research',
    priority: 'high',
    status: 'in-progress',
    startDate: new Date('2025-02-21').toISOString(),
    dueDate: new Date('2025-02-25').toISOString(),
    completed: false,
    dependencies: ['101']
  },
  {
    id: '103',
    projectId: '1',
    title: 'Improve page load speed',
    description: 'Optimize images and implement lazy loading',
    priority: 'medium',
    status: 'in-queue',
    startDate: new Date('2025-02-26').toISOString(),
    dueDate: new Date('2025-03-05').toISOString(),
    completed: false,
    dependencies: []
  },
  {
    id: '201',
    projectId: '2',
    title: 'Content audit',
    description: 'Audit existing content and identify gaps',
    priority: 'high',
    status: 'in-progress',
    startDate: new Date('2025-03-02').toISOString(),
    dueDate: new Date('2025-03-10').toISOString(),
    completed: false,
    dependencies: []
  },
  {
    id: '202',
    projectId: '2',
    title: 'Create content calendar',
    description: 'Plan content topics and publishing schedule',
    priority: 'medium',
    status: 'in-queue',
    startDate: new Date('2025-03-05').toISOString(),
    dueDate: new Date('2025-03-15').toISOString(),
    completed: false,
    dependencies: ['201']
  }
];

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

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>(initialProjects);
  
  // Load tasks from localStorage and generate demo data for non-logged-in users
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // For non-logged-in users, generate demo data if none exists
      if (!user) {
        // Generate demo project with tasks
        generateDemoProjectWithTasks();
      }
      
      // Load tasks from localStorage
      const storedTasks = localStorage.getItem('seoTasks');
      if (storedTasks) {
        try {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);
        } catch (error) {
          console.error('Error parsing tasks from localStorage:', error);
          setTasks(mockTasks);
        }
      } else {
        // Initialize with mock tasks if no tasks in localStorage
        localStorage.setItem('seoTasks', JSON.stringify(mockTasks));
        setTasks(mockTasks);
      }
      
      // Load projects from localStorage
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
  }, [user]);
  
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get upcoming tasks (due in the next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        return !task.completed && dueDate >= today && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Task Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h4" color="primary">
                    {totalTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h4" color="success.main">
                    {completedTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h4" color="info.main">
                    {inProgressTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h4" color="error.main">
                    {highPriorityTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Overall Completion
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={completionPercentage} 
                    color="success"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {completionPercentage}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Upcoming Tasks */}
        <Grid item xs={12} sm={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Tasks
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {upcomingTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No upcoming tasks due in the next 7 days
                </Typography>
              </Box>
            ) : (
              <List>
                {upcomingTasks.map((task) => (
                  <ListItem key={task.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {task.priority === 'high' ? (
                        <PriorityHighIcon color="error" />
                      ) : (
                        <AssignmentIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography variant="body1">{task.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Project: {projects.find(p => p.id === task.projectId)?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} 
                          size="small" 
                          color={getPriorityColor(task.priority) as any}
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label={task.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} 
                          size="small" 
                          color={getStatusColor(task.status) as any}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

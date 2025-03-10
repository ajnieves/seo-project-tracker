'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeRegistry';
import DataManagement from '@/components/DataManagement';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Switch, 
  Button, 
  TextField, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert, 
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityIcon from '@mui/icons-material/Security';
import PaletteIcon from '@mui/icons-material/Palette';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import BackupIcon from '@mui/icons-material/Backup';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      taskReminders: true,
      weeklyDigest: false
    },
    appearance: {
      theme: 'light',
      density: 'comfortable',
      fontSize: 'medium'
    },
    privacy: {
      showCompletedTasks: true,
      showTaskDetails: true,
      shareAnalytics: false
    }
  });
  
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'SEO Manager',
    company: 'Acme Inc.',
    bio: 'Experienced SEO professional with 5+ years in the industry.'
  });
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Import the useTheme hook
  const { mode, setMode } = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNotificationChange = (setting: keyof typeof settings.notifications) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [setting]: !settings.notifications[setting]
      }
    });
    
    setSnackbar({
      open: true,
      message: 'Notification settings updated',
      severity: 'success'
    });
  };

  // Update the appearance settings with the current theme mode
  useEffect(() => {
    setSettings(prevSettings => ({
      ...prevSettings,
      appearance: {
        ...prevSettings.appearance,
        theme: mode
      }
    }));
  }, [mode]);

  const handleAppearanceChange = (setting: keyof typeof settings.appearance, value: string) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [setting]: value
      }
    });
    
    // Update the theme mode when the theme setting changes
    if (setting === 'theme') {
      setMode(value as 'light' | 'dark' | 'system');
    }
    
    setSnackbar({
      open: true,
      message: 'Appearance settings updated',
      severity: 'success'
    });
  };

  const handlePrivacyChange = (setting: keyof typeof settings.privacy) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [setting]: !settings.privacy[setting]
      }
    });
    
    setSnackbar({
      open: true,
      message: 'Privacy settings updated',
      severity: 'success'
    });
  };

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  const handleSaveProfile = () => {
    setEditingProfile(false);
    setSnackbar({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs" variant="scrollable" scrollButtons="auto">
          <Tab icon={<AccountCircleIcon />} label="Profile" {...a11yProps(0)} />
          <Tab icon={<NotificationsIcon />} label="Notifications" {...a11yProps(1)} />
          <Tab icon={<PaletteIcon />} label="Appearance" {...a11yProps(2)} />
          <Tab icon={<SecurityIcon />} label="Privacy" {...a11yProps(3)} />
          <Tab icon={<BackupIcon />} label="Data" {...a11yProps(4)} />
        </Tabs>
      </Box>
      
      {/* Profile Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                {profile.name.charAt(0)}
              </Avatar>
            }
            action={
              <IconButton 
                aria-label="edit profile" 
                onClick={() => setEditingProfile(!editingProfile)}
              >
                {editingProfile ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            }
            title={
              <Typography variant="h6">
                {profile.name}
              </Typography>
            }
            subheader={profile.role}
          />
          <CardContent>
            {editingProfile ? (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Role"
                    fullWidth
                    value={profile.role}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company"
                    fullWidth
                    value={profile.company}
                    onChange={(e) => handleProfileChange('company', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bio"
                    fullWidth
                    multiline
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                  >
                    Save Profile
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {profile.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Company
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {profile.company}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bio
                  </Typography>
                  <Typography variant="body1">
                    {profile.bio}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </TabPanel>
      
      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Email Notifications" 
                secondary="Receive notifications via email"
              />
              <Switch
                edge="end"
                checked={settings.notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Browser Notifications" 
                secondary="Receive notifications in your browser"
              />
              <Switch
                edge="end"
                checked={settings.notifications.browser}
                onChange={() => handleNotificationChange('browser')}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Task Reminders" 
                secondary="Get reminders for upcoming tasks"
              />
              <Switch
                edge="end"
                checked={settings.notifications.taskReminders}
                onChange={() => handleNotificationChange('taskReminders')}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Weekly Digest" 
                secondary="Receive a weekly summary of your projects"
              />
              <Switch
                edge="end"
                checked={settings.notifications.weeklyDigest}
                onChange={() => handleNotificationChange('weeklyDigest')}
              />
            </ListItem>
          </List>
        </Paper>
      </TabPanel>
      
      {/* Appearance Tab */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Appearance Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.appearance.theme}
                  label="Theme"
                  onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="system">System Default</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Density</InputLabel>
                <Select
                  value={settings.appearance.density}
                  label="Density"
                  onChange={(e) => handleAppearanceChange('density', e.target.value)}
                >
                  <MenuItem value="comfortable">Comfortable</MenuItem>
                  <MenuItem value="compact">Compact</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Font Size</InputLabel>
                <Select
                  value={settings.appearance.fontSize}
                  label="Font Size"
                  onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                >
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>
      
      {/* Privacy Tab */}
      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Privacy Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            <ListItem>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Show Completed Tasks" 
                secondary="Display completed tasks in project views"
              />
              <Switch
                edge="end"
                checked={settings.privacy.showCompletedTasks}
                onChange={() => handlePrivacyChange('showCompletedTasks')}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Show Task Details" 
                secondary="Display detailed information about tasks"
              />
              <Switch
                edge="end"
                checked={settings.privacy.showTaskDetails}
                onChange={() => handlePrivacyChange('showTaskDetails')}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Share Analytics" 
                secondary="Share anonymous usage data to help improve the app"
              />
              <Switch
                edge="end"
                checked={settings.privacy.shareAnalytics}
                onChange={() => handlePrivacyChange('shareAnalytics')}
              />
            </ListItem>
          </List>
        </Paper>
      </TabPanel>
      
      {/* Data Management Tab */}
      <TabPanel value={tabValue} index={4}>
        <DataManagement />
      </TabPanel>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

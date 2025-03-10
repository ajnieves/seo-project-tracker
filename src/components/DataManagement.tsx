'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import { dataService } from '@/services/dataService';
import ProjectBulkActions from './ProjectBulkActions';

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
      id={`data-tabpanel-${index}`}
      aria-labelledby={`data-tab-${index}`}
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
    id: `data-tab-${index}`,
    'aria-controls': `data-tabpanel-${index}`,
  };
}

export default function DataManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle exporting data
  const handleExportData = () => {
    try {
      // Get all data as JSON
      const jsonData = dataService.exportAllData();
      
      // Create a blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `seo-project-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: 'Data exported successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      setSnackbar({
        open: true,
        message: 'Error exporting data',
        severity: 'error'
      });
    }
  };
  
  // Handle importing data
  const handleImportData = () => {
    try {
      if (!importData.trim()) {
        setSnackbar({
          open: true,
          message: 'No data to import',
          severity: 'error'
        });
        return;
      }
      
      const success = dataService.importAllData(importData);
      
      if (success) {
        setSnackbar({
          open: true,
          message: 'Data imported successfully. Please refresh the page to see the changes.',
          severity: 'success'
        });
        setImportDialogOpen(false);
        setImportData('');
      } else {
        setSnackbar({
          open: true,
          message: 'Error importing data: Invalid format',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error importing data:', error);
      setSnackbar({
        open: true,
        message: 'Error importing data',
        severity: 'error'
      });
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };
  
  // Handle clearing all data
  const handleClearData = () => {
    try {
      dataService.clearAllData();
      setSnackbar({
        open: true,
        message: 'All data cleared successfully. Please refresh the page to see the changes.',
        severity: 'success'
      });
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error clearing data:', error);
      setSnackbar({
        open: true,
        message: 'Error clearing data',
        severity: 'error'
      });
    }
  };
  
  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>Data Management</Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="data management tabs">
          <Tab label="Backup & Restore" {...a11yProps(0)} />
          <Tab label="Project Management" {...a11yProps(1)} />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Backup Your Data</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Export your data to a JSON file that you can save on your computer. This allows you to back up your projects, tasks, and settings.
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />}
              onClick={handleExportData}
            >
              Export Data
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>Restore Your Data</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Import previously exported data to restore your projects, tasks, and settings.
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<UploadIcon />}
              onClick={() => setImportDialogOpen(true)}
            >
              Import Data
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>Reset Application</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Clear all data and reset the application to its initial state. This action cannot be undone.
            </Typography>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => setConfirmDialogOpen(true)}
            >
              Reset Application
            </Button>
          </Box>
        </Box>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <ProjectBulkActions />
      </TabPanel>
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Import Data</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Upload a previously exported JSON file or paste the JSON data below.
          </DialogContentText>
          
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Backup File
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
          
          <TextField
            label="Or paste JSON data here"
            multiline
            rows={10}
            fullWidth
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder='{"projects": [...], "tasks": [...], ...}'
          />
          
          <Alert severity="warning" sx={{ mt: 2 }}>
            Importing data will overwrite your current data. Make sure to export your current data first if you want to keep it.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleImportData} 
            variant="contained" 
            startIcon={<RestoreIcon />}
            disabled={!importData.trim()}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the application? This will delete all your projects, tasks, and settings. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearData} color="error" variant="contained">
            Reset
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

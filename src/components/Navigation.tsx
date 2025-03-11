'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Avatar, 
  useMediaQuery, 
  useTheme,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const collapsedDrawerWidth = 64; // Width of drawer when collapsed

  // Load drawer state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('drawerCollapsed');
      if (savedState) {
        setDrawerCollapsed(savedState === 'true');
      }
    }
  }, []);

  // Save drawer state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('drawerCollapsed', drawerCollapsed.toString());
    }
  }, [drawerCollapsed]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDrawerCollapse = () => {
    setDrawerCollapsed(!drawerCollapsed);
  };

  // Navigation items
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, href: '/' },
    { text: 'Projects', icon: <AssignmentIcon />, href: '/projects' },
    { text: 'Settings', icon: <SettingsIcon />, href: '/settings' },
  ];

  // Define types for menu items
  type MenuItemWithHref = { text: string; href: string; onClick?: undefined };
  type MenuItemWithOnClick = { text: string; onClick: () => void; href?: undefined };
  type MenuItem = MenuItemWithHref | MenuItemWithOnClick;

  // User menu items based on authentication status
  const userMenuItems: MenuItem[] = user
    ? [
        { text: 'Logout', onClick: () => logout() },
      ]
    : [
        { text: 'Login / Register', href: '/auth' },
      ];

  // Drawer content
  const drawerContent = (
    <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* User profile section at the top */}
      {!drawerCollapsed && (
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Avatar 
            alt={user?.name || 'User'} 
            sx={{ 
              width: 64, 
              height: 64, 
              mx: 'auto', 
              mb: 1,
              bgcolor: 'secondary.main',
              boxShadow: 2
            }}
          >
            {user ? (
              user.name 
                ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                : user.email.substring(0, 2).toUpperCase()
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user ? (user.name || user.email) : 'Guest User'}
          </Typography>
        </Box>
      )}
      
      {drawerCollapsed ? (
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Avatar 
            alt={user?.name || 'User'} 
            sx={{ 
              width: 40, 
              height: 40, 
              mx: 'auto', 
              my: 1,
              bgcolor: 'primary.main',
            }}
          >
            {user ? (
              user.name 
                ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 1)
                : user.email.substring(0, 1).toUpperCase()
            ) : (
              <AccountCircleIcon fontSize="small" />
            )}
          </Avatar>
        </Box>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            SEO Projects Tracker
          </Typography>
        </Box>
      )}
      
      <Divider />
      
      {/* Main navigation */}
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={drawerCollapsed ? item.text : ""} placement="right">
              <ListItemButton 
                component={Link} 
                href={item.href}
                selected={pathname === item.href}
                sx={{
                  minHeight: 48,
                  justifyContent: drawerCollapsed ? 'center' : 'initial',
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerCollapsed ? 'auto' : 3,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!drawerCollapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Collapse/Expand button */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', my: 1 }}>
        <IconButton onClick={toggleDrawerCollapse}>
          {drawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      
      {/* User menu items at the bottom */}
      <Divider />
      <List>
        {userMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={drawerCollapsed ? item.text : ""} placement="right">
              {item.href ? (
                <ListItemButton 
                  component={Link} 
                  href={item.href}
                  sx={{
                    minHeight: 48,
                    justifyContent: drawerCollapsed ? 'center' : 'initial',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerCollapsed ? 'auto' : 3,
                      justifyContent: 'center',
                    }}
                  >
                    <AccountCircleIcon />
                  </ListItemIcon>
                  {!drawerCollapsed && <ListItemText primary={item.text} />}
                </ListItemButton>
              ) : (
                <ListItemButton 
                  onClick={item.onClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: drawerCollapsed ? 'center' : 'initial',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerCollapsed ? 'auto' : 3,
                      justifyContent: 'center',
                    }}
                  >
                    <AccountCircleIcon />
                  </ListItemIcon>
                  {!drawerCollapsed && <ListItemText primary={item.text} />}
                </ListItemButton>
              )}
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', overflow: 'hidden' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {isMobile ? 'SEO Tracker' : 'SEO Projects Tracker'}
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerCollapsed ? collapsedDrawerWidth : drawerWidth },
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              width: drawerCollapsed ? collapsedDrawerWidth : drawerWidth, 
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: 'none',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          <Toolbar /> {/* This creates space for the AppBar */}
          {drawerContent}
        </Drawer>
      </Box>
      
      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          position: 'relative',
          marginLeft: { 
            xs: 0,
            sm: 0 // We don't need margin-left since the drawer is fixed
          },
          width: '100%', // Take full width of the available space
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          mt: '64px', // Height of AppBar
          mb: '48px', // Height of footer
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

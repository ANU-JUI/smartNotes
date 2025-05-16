import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import NoteIcon from '@mui/icons-material/Note';
import TaskIcon from '@mui/icons-material/Task';
import NoteList from './components/NoteList';
import TaskList from './components/TaskList';
import NoteForm from './components/NoteForm';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For user menu
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Check if user is logged in
  const username = localStorage.getItem('username'); // Retrieve username from local storage

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f5e6ca',
        contrastText: '#5a4b3f',
      },
      secondary: {
        main: '#d4a373',
        contrastText: '#ffffff',
      },
      background: {
        default: darkMode ? '#121212' : '#fdf6e3',
        paper: darkMode ? '#1e1e1e' : '#f5e6ca',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#5a4b3f',
        secondary: darkMode ? '#bdbdbd' : '#8d6e63',
      },
    },
    typography: {
      fontFamily: `'Poppins', sans-serif`,
      h5: {
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  });

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    setAnchorEl(null);
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          drawerOpen={drawerOpen}
          handleDrawerToggle={handleDrawerToggle}
          handleMenuOpen={handleMenuOpen}
          handleMenuClose={handleMenuClose}
          handleLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          username={username}
          anchorEl={anchorEl}
        />
      </Router>
    </ThemeProvider>
  );
}

function Layout({
  darkMode,
  setDarkMode,
  drawerOpen,
  handleDrawerToggle,
  handleMenuOpen,
  handleMenuClose,
  handleLogout,
  isAuthenticated,
  username,
  anchorEl,
  updateAuthState,
}) {
  const location = useLocation();

  // Check if the current path is login or signup
  const hideSidebar = location.pathname === '/login' || location.pathname === '/signup';
  const hideUserInfo = location.pathname === '/login' || location.pathname === '/signup'; // Hide user info on login/signup


  console.log('Current Path:', location.pathname); // Debugging log
  console.log('Hide Sidebar:', hideSidebar); // Debugging log

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {!hideSidebar && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Smart Notes
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setDarkMode(!darkMode)}
            sx={{ mr: 2 }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {!hideUserInfo && isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: '#5a4b1f',
                      color: '#ffffff',
                    }}
                  >
                    {username ? username.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {username}
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: '45px' }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      {!hideSidebar && (
        <Box
          component="nav"
          sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
          >
            <Box sx={{ textAlign: 'center', p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
              SMART NOTES
            </Box>
            <Divider />
            <List>
              <ListItem button component={Link} to="/home" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <NoteIcon />
                </ListItemIcon>
                <ListItemText primary="Notes" />
              </ListItem>
              <ListItem button component={Link} to="/tasks" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <TaskIcon />
                </ListItemIcon>
                <ListItemText primary="Tasks" />
              </ListItem>
            </List>
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
            open
          >
            <Box sx={{ textAlign: 'center', p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
              SMART NOTES
            </Box>
            <Divider />
            <List>
              <ListItem button component={Link} to="/home">
                <ListItemIcon>
                  <NoteIcon />
                </ListItemIcon>
                <ListItemText primary="Notes" />
              </ListItem>
              <ListItem button component={Link} to="/tasks">
                <ListItemIcon>
                  <TaskIcon />
                </ListItemIcon>
                <ListItemText primary="Tasks" />
              </ListItem>
            </List>
          </Drawer>
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: hideSidebar ? '100%' : { sm: `calc(100% - 240px)` },
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<NoteList />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/note/new" element={<NoteForm />} />
          <Route path="/task/new" element={<TaskForm />} />
          <Route path="/note/:id" element={<NoteForm />} />
          <Route path="/task/:id" element={<TaskForm />} />
          <Route path="/login" element={<Login updateAuthState={updateAuthState} />} />
          <Route path="/signup" element={<Signup updateAuthState={updateAuthState} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
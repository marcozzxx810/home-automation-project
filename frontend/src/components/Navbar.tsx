import { AccountCircle } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';

export const Navbar: React.FC = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/login');
    setAnchorEl(null);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerOpened(open);
    };
  return location.pathname != '/' &&
    location.pathname != '/signup' &&
    location.pathname != '/login' ? (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor={'left'} open={drawerOpened} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation" onKeyDown={toggleDrawer(false)}>
            <Toolbar />
            <Divider />
            <List>
              <ListItemButton
                onClick={() => {
                  navigate('/home');
                  setDrawerOpened(false);
                }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mak Home App
        </Typography>
        {user && (
          <div>
            <Typography>Hi, {user.username}</Typography>
          </div>
        )}
        {user && (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogOut}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  ) : null;
};

import React from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let role = null;

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    role = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }

  const menu = [
    { label: 'Recepção', path: '/recepcao', roles: ['admin', 'medico'] },
    { label: 'Triagem', path: '/triagem', roles: ['admin', 'medico'] },
    { label: 'Faturamento', path: '/faturamento', roles: ['admin'] },
    { label: 'Relatórios', path: '/relatorios', roles: ['admin'] },  
    { label: 'Especialidades', path: '/especialidades', roles: ['admin'] },
    { label: 'Medicos', path: '/medicos', roles: ['admin'] },
    { label: 'Pacientes', path: '/pacientes', roles: ['admin'] },


  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Clínica Online</Typography>
          <Button color="inherit" onClick={handleLogout}>Sair</Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <List>
          {menu
            .filter(item => role && item.roles.includes(role))
            .map((item) => (
              <ListItem button key={item.label} onClick={() => navigate(item.path)}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
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
    { label: 'Faturamentos', path: '/faturamentos', roles: ['admin'] },
    // { label: 'Relatórios', path: '/relatorios', roles: ['admin'] },  
    { label: 'Especialidades', path: '/especialidades', roles: ['admin'] },
    { label: 'Medicos', path: '/medicos', roles: ['admin'] },
    { label: 'Pacientes', path: '/pacientes', roles: ['admin'] },
    { label: 'Usuarios', path: '/usuarios', roles: ['admin'] },
    { label: 'Agendamentos', path: '/agendamentos', roles: ['admin'] },
    { label: 'Consultas Médicas', path: '/consultas', roles: ['admin'] },
    { label: 'Relatorios Faturamentos', path: '/relatoriosFaturamentos', roles: ['admin'] },
    { label: 'Dashboard Financeiros', path: '/dashboardFinanceiro', roles: ['admin'] },
    { label: 'Relatório Médico', path: '/relatorioConsultaMedica', roles: ['admin'] },
    { label: 'Relatório Comparecimento', path: '/relatorioComparecimento', roles: ['admin'] },
    { label: 'Relatório Agendamento Período', path: '/relatorioAgendamentosPorPeriodo', roles: ['admin'] },
    { label: 'Relatório Paciente Recorrente', path: '/relatorioPacientesRecorrentes', roles: ['admin'] },
    { label: 'Relatório Produção Médica', path: '/relatorioProducaoMedica', roles: ['admin'] },



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
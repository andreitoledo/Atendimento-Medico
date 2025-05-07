import React from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemText, Button, Divider
} from '@mui/material';
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

  const sections = [
    {
      title: '📋 Atendimento',
      items: [
        { label: 'Recepção', path: '/recepcao', roles: ['admin', 'medico'] },
        { label: 'Triagem', path: '/triagem', roles: ['admin', 'medico'] },
        { label: 'Agendamentos', path: '/agendamentos', roles: ['admin'] },
        { label: 'Consultas Médicas', path: '/consultas', roles: ['admin', 'medico'] },
        { label: 'Agenda', path: '/agendaPage', roles: ['admin', 'medico'] },
        { label: 'Salas', path: '/SalasPage', roles: ['admin', 'medico'] },

      ]
    },
    {
      title: '⚙️ Administrativo',
      items: [
        { label: 'Faturamentos', path: '/faturamentos', roles: ['admin'] },
        { label: 'Especialidades', path: '/especialidades', roles: ['admin'] },
        { label: 'Medicos', path: '/medicos', roles: ['admin'] },
        { label: 'Pacientes', path: '/pacientes', roles: ['admin'] },
        { label: 'Usuarios', path: '/usuarios', roles: ['admin'] },
      ]
    },
    {
      title: '📊 Relatórios',
      items: [
        { label: 'Faturamentos', path: '/relatoriosFaturamentos', roles: ['admin'] },
        { label: 'Dashboard Financeiros', path: '/dashboardFinanceiro', roles: ['admin'] },
        { label: 'Consulta Médica', path: '/relatorioConsultaMedica', roles: ['admin', 'medico'] },
        { label: 'Comparecimento', path: '/relatorioComparecimento', roles: ['admin'] },
        { label: 'Agendamento por Período', path: '/relatorioAgendamentosPorPeriodo', roles: ['admin'] },
        { label: 'Paciente Recorrente', path: '/relatorioPacientesRecorrentes', roles: ['admin'] },
        { label: 'Produção Médica', path: '/relatorioProducaoMedica', roles: ['admin'] },
        { label: 'Consulta por Especialidade', path: '/relatorioConsultasPorEspecialidades', roles: ['admin'] },
        { label: 'Consulta Por Dia', path: '/relatorioConsultasPorDia', roles: ['admin'] },
      ]
    },
    {
      title: '📋 Pagamentos',
      items: [
        { label: 'Pagamentos', path: '/pagamentoForm', roles: ['admin'] },
        { label: 'Dashboard Conciliação', path: '/dashboardFinanceiroConciliacaoPage', roles: ['admin'] },

      ]
    },
    {
      title: '📋 Outros',
      items: [
        { label: 'Prontuario Clinico', path: '/prontuario-clinico/:id', roles: ['admin', 'medico'] },
        { label: 'Prontuario Psicologo', path: '/prontuario-psicologo/:id', roles: ['admin', 'medico'] },
        { label: 'Prontuario Psiquiatra', path: '/prontuario-psiquiatra/:id', roles: ['admin', 'medico'] },
        { label: 'Listagem de Triagens', path: '/triagens', roles: ['admin', 'medico'] }

      ]
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>          
          <Typography variant="h10">Versão 1.0.00</Typography>
          <Typography variant="h5">Clínica Médica de Atendimento Online</Typography>
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
          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ pl: 2, fontWeight: 'bold', color: 'gray' }}>
                {section.title}
              </Typography>
              {section.items
                .filter(item => role && item.roles.includes(role))
                .map((item) => (
                  <ListItem button key={item.label} onClick={() => navigate(item.path)}>
                    <ListItemText primary={item.label} />
                  </ListItem>
                ))}
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      {/* <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        {children}
      </Box> */}
      <Box component="main" sx={{ flexGrow: 1, ml: `${drawerWidth}px`, pr: 2, overflowX: 'auto' }}>
        <Toolbar />
        <Box sx={{ maxWidth: `calc(100vw - ${drawerWidth + 32}px)`, pl: 2 }}>
          {children}
        </Box>
      </Box>


    </Box>
  );
};

export default Layout;

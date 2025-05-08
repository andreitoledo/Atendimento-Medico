import React, { useState } from "react";
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemText, Button, Divider, IconButton, Tooltip, ListItemIcon, Collapse
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "./ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import EventIcon from "@mui/icons-material/Event";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import ListAltIcon from "@mui/icons-material/ListAlt";

const drawerWidth = 240;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { toggleColorMode, mode } = useThemeContext();
  const [open, setOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(null);

  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    role = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }

  const toggleSection = (index) => {
    setActiveSection(prev => (prev === index ? null : index));
  };

  const sections = [
    {
      title: "📋 Atendimento",
      items: [
        { label: "Recepção", path: "/recepcao", icon: <PeopleIcon />, roles: ["admin", "medico"] },
        { label: "Triagem", path: "/triagem", icon: <MedicalServicesIcon />, roles: ["admin", "medico"] },
        { label: "Agendamentos", path: "/agendamentos", icon: <EventIcon />, roles: ["admin"] },
        { label: "Consultas Médicas", path: "/consultas", icon: <LocalHospitalIcon />, roles: ["admin", "medico"] },
        { label: "Agenda", path: "/agendaPage", icon: <EventIcon />, roles: ["admin", "medico"] },
        { label: "Salas", path: "/SalasPage", icon: <RoomIcon />, roles: ["admin", "medico"] },
      ],
    },
    {
      title: "⚙️ Administrativo",
      items: [
        { label: "Faturamentos", path: "/faturamentos", icon: <AttachMoneyIcon />, roles: ["admin"] },
        { label: "Especialidades", path: "/especialidades", icon: <MedicalServicesIcon />, roles: ["admin"] },
        { label: "Medicos", path: "/medicos", icon: <LocalHospitalIcon />, roles: ["admin"] },
        { label: "Pacientes", path: "/pacientes", icon: <PeopleIcon />, roles: ["admin"] },
        { label: "Usuarios", path: "/usuarios", icon: <PeopleIcon />, roles: ["admin"] },
      ],
    },
    {
      title: "📊 Relatórios",
      items: [
        { label: "Faturamentos", path: "/relatoriosFaturamentos", icon: <AssessmentIcon />, roles: ["admin"] },
        { label: "Dashboard Financeiros", path: "/dashboardFinanceiro", icon: <AssessmentIcon />, roles: ["admin"] },
        { label: "Consulta Médica", path: "/relatorioConsultaMedica", icon: <AssessmentIcon />, roles: ["admin", "medico"] },
        { label: "Comparecimento", path: "/relatorioComparecimento", icon: <AssessmentIcon />, roles: ["admin"] },
        { label: "Agendamento por Período", path: "/relatorioAgendamentosPorPeriodo", icon: <AssessmentIcon />, roles: ["admin"] },
        { label: "Paciente Recorrente", path: "/relatorioPacientesRecorrentes", icon: <AssessmentIcon />, roles: ["admin"] },
        { label: "Produção Médica", path: "/relatorioProducaoMedica", icon: <AssessmentIcon />, roles: ["admin"] },
        { label: "Consulta por Especialidade", path: "/relatorioConsultasPorEspecialidades", icon: <AssessmentIcon />, roles: ["admin"] },
        { label: "Consulta Por Dia", path: "/relatorioConsultasPorDia", icon: <AssessmentIcon />, roles: ["admin"] },
      ],
    },
    {
      title: "📋 Pagamentos",
      items: [
        { label: "Pagamentos", path: "/pagamentoForm", icon: <AttachMoneyIcon />, roles: ["admin"] },
        { label: "Dashboard Conciliação", path: "/dashboardFinanceiroConciliacaoPage", icon: <AssessmentIcon />, roles: ["admin"] },
      ],
    },
    {
      title: "📋 Outros",
      items: [
        { label: "Prontuario Clinico", path: "/prontuario-clinico/:id", icon: <FolderSharedIcon />, roles: ["admin", "medico"] },
        { label: "Prontuario Psicologo", path: "/prontuario-psicologo/:id", icon: <FolderSharedIcon />, roles: ["admin", "medico"] },
        { label: "Prontuario Psiquiatra", path: "/prontuario-psiquiatra/:id", icon: <FolderSharedIcon />, roles: ["admin", "medico"] },
        { label: "Listagem de Triagens", path: "/triagens", icon: <ListAltIcon />, roles: ["admin", "medico"] },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => setOpen(!open)} color="inherit">
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="body1">Versão 1.0.00</Typography>
          </Box>
          <Typography variant="h6">Clínica Médica de Atendimento Online</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Alternar tema">
              <IconButton color="inherit" onClick={toggleColorMode}>
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Button color="inherit" onClick={handleLogout}>Sair</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 64,
            overflowX: "hidden",
            transition: "width 0.3s",
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {sections.map((section, idx) => {
            const isOpen = activeSection === idx;
            const visibleItems = section.items.filter(item => role && item.roles.includes(role));

            if (!visibleItems.length) return null;

            return (
              <React.Fragment key={idx}>
                <Divider />
                <ListItem button onClick={() => toggleSection(idx)}>
                  <ListItemText primary={open ? section.title : section.title.charAt(0)} />
                  {open && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>

                <Collapse in={isOpen && open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {visibleItems.map((item) => (
                      <ListItem button key={item.label} sx={{ pl: 4 }} onClick={() => navigate(item.path)}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          })}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, ml: `${open ? drawerWidth : 64}px`, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

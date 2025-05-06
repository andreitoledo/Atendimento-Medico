
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography, Select, MenuItem, Paper } from '@mui/material';
import Layout from '../components/Layout';

const AgendaPage = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSalas();
    fetchAgendamentos();
  }, []);

  const fetchSalas = async () => {
    const res = await fetch('https://localhost:44327/api/Sala', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setSalas(data);
  };

  const fetchAgendamentos = async () => {
    const res = await fetch('https://localhost:44327/api/Agendamento', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAgendamentos(data);
  };

  const eventos = agendamentos
    .filter(a => !salaSelecionada || a.salaId === parseInt(salaSelecionada))
    .map(a => ({
      id: a.id,
      title: `${a.nomePaciente} - ${a.nomeMedico}`,
      start: a.dataConsulta,
      end: a.dataConsulta,
      backgroundColor: '#1976d2',
      borderColor: '#1976d2'
    }));

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Agenda</Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Select
            value={salaSelecionada}
            onChange={e => setSalaSelecionada(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">Todas as Salas</MenuItem>
            {salas.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.nome}</MenuItem>
            ))}
          </Select>
        </Paper>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          events={eventos}
          locale="pt-br"
          height="auto"
        />
      </Box>
    </Layout>
  );
};

export default AgendaPage;

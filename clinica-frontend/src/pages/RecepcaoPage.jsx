import React, { useEffect, useState } from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress } from '@mui/material';

const RecepcaoPage = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('https://localhost:44327/api/Recepcao/hoje', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Erro ao buscar agendamentos');
        return res.json();
      })
      .then((data) => {
        setAgendamentos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Recepção - Agendamentos de Hoje</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Médico</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Check-In</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agendamentos.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.pacienteNome}</TableCell>
                  <TableCell>{a.medicoNome}</TableCell>
                  <TableCell>{new Date(a.dataConsulta).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{a.status}</TableCell>
                  <TableCell>{a.checkIn ? 'Sim' : 'Não'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RecepcaoPage;
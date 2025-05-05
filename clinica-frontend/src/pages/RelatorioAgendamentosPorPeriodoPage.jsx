import React, { useState } from "react";
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableHead,
  TableRow, TextField, Typography
} from "@mui/material";
import Layout from "../components/Layout";

const RelatorioAgendamentosPorPeriodoPage = () => {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const token = localStorage.getItem("token");

  const buscarAgendamentos = async () => {
    if (!inicio || !fim) return;

    const url = `https://localhost:44327/api/Relatorios/agendamentos-por-periodo?inicio=${inicio}&fim=${fim}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setAgendamentos(data);
    }
  };

  const limpar = () => {
    setInicio("");
    setFim("");
    setAgendamentos([]);
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Relatório de Agendamentos por Período</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Data Início"
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data Fim"
              type="date"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" onClick={buscarAgendamentos}>Buscar</Button>
            <Button variant="outlined" onClick={limpar}>Limpar</Button>
          </Box>
        </Paper>

        {agendamentos.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Médico</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Plataforma</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agendamentos.map((a, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(a.dataConsulta).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{a.paciente}</TableCell>
                    <TableCell>{a.medico}</TableCell>
                    <TableCell>{a.status}</TableCell>
                    <TableCell>{a.plataforma}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default RelatorioAgendamentosPorPeriodoPage;

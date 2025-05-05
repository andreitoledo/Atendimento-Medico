import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Button
} from "@mui/material";
import Layout from "../components/Layout";

const RelatorioPacientesRecorrentesPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const token = localStorage.getItem("token");

  const fetchDados = async () => {
    const res = await fetch("https://localhost:44327/api/Relatorios/consultas-por-paciente", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setPacientes(data);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const exportarCSV = () => {
    const header = "Paciente,Total Consultas\n";
    const rows = pacientes.map(p => `${p.nomePaciente},${p.totalConsultas}`).join("\n");
    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "pacientes_recorrentes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Pacientes Mais Recorrentes</Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell align="right">Total de Consultas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pacientes.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>{p.nomePaciente}</TableCell>
                  <TableCell align="right">{p.totalConsultas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Button variant="contained" onClick={exportarCSV}>
          Exportar CSV
        </Button>
      </Box>
    </Layout>
  );
};

export default RelatorioPacientesRecorrentesPage;

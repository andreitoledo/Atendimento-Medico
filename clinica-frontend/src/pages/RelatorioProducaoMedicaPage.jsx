import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@mui/material";

const RelatorioProducaoMedicaPage = () => {
  const [dados, setDados] = useState([]);
  const token = localStorage.getItem("token");

  const buscarDados = async () => {
    const res = await fetch("https://localhost:44327/api/Relatorios/producao-medica", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setDados(data);
    }
  };

  const exportarCsv = () => {
    let csv = "Nome Médico,Especialidade,Total Consultas\n";
    dados.forEach(d => {
      csv += `${d.nomeMedico},${d.especialidade || "Não informado"},${d.totalConsultas}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "producao_medica.csv";
    a.click();
  };

  useEffect(() => {
    buscarDados();
  }, []);

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Relatório de Produção Médica</Typography>

        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Médico</TableCell>
                <TableCell>Especialidade</TableCell>
                <TableCell align="right">Total Consultas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dados.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.nomeMedico}</TableCell>
                  <TableCell>{item.especialidade || "Não informado"}</TableCell>
                  <TableCell align="right">{item.totalConsultas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box mt={2}>
            <Button variant="outlined" onClick={exportarCsv}>Exportar CSV</Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default RelatorioProducaoMedicaPage;

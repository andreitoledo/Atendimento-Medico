import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RelatorioConsultasPorDiaPage = () => {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [dados, setDados] = useState([]);
  const token = localStorage.getItem("token");

  const buscar = async () => {
    if (!inicio || !fim) return;

    const res = await fetch(`https://localhost:44327/api/Relatorios/consultas-por-dia?inicio=${inicio}&fim=${fim}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setDados(data);
    }
  };

  const chartData = {
    labels: [...new Set(dados.map(d => new Date(d.dia).toLocaleDateString("pt-BR")))],
    datasets: [
      {
        label: "Consultas por Dia",
        data: dados.reduce((acc, d) => {
          const dia = new Date(d.dia).toLocaleDateString("pt-BR");
          acc[dia] = (acc[dia] || 0) + d.totalConsultas;
          return acc;
        }, {}),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Relatório de Consultas por Dia
        </Typography>

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
            <Button variant="contained" onClick={buscar}>Buscar</Button>
          </Box>
        </Paper>

        {dados.length > 0 && (
          <>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Line data={chartData} />
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Médico</TableCell>
                    <TableCell>Especialidade</TableCell>
                    <TableCell>Total de Consultas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dados.map((d, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(d.dia).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{d.nomeMedico || "-"}</TableCell>
                      <TableCell>{d.especialidade || "-"}</TableCell>
                      <TableCell>{d.totalConsultas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default RelatorioConsultasPorDiaPage;

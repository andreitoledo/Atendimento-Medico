import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box,
  Typography,
  Paper,
  Button
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip);

const RelatorioComparecimentoPage = () => {
  const [dados, setDados] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    const res = await fetch("https://localhost:44327/api/Relatorios/comparecimentos", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setDados(data);
    }
  };

  const exportarCSV = () => {
    const csv = [
      ["Status", "Quantidade"],
      ...dados.map(d => [d.status, d.quantidade])
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio_comparecimento.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const chartData = {
    labels: dados.map(d => d.status),
    datasets: [
      {
        label: "Consultas",
        data: dados.map(d => d.quantidade),
        backgroundColor: "royalblue"
      }
    ]
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Relatório de Comparecimento
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Bar data={chartData} />
        </Paper>

        <Button variant="contained" color="primary" onClick={exportarCSV}>
          Exportar CSV
        </Button>
      </Box>
    </Layout>
  );
};

export default RelatorioComparecimentoPage;

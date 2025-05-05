import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import Layout from "../components/Layout";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RelatorioConsultasPorEspecialidadesPage = () => {
  const [dados, setDados] = useState([]);
  const token = localStorage.getItem("token");

  const fetchDados = async () => {
    try {
      const res = await fetch("https://localhost:44327/api/Relatorios/consultas-por-especialidade", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDados(data);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  const exportarCSV = () => {
    const csvHeader = "Especialidade,Total Consultas\n";
    const csvRows = dados.map(item => `${item.especialidade},${item.totalConsultas}`);
    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "consultas_por_especialidade.csv";
    link.click();
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const chartData = {
    labels: dados.map(d => d.especialidade ?? "Não informado"),
    datasets: [
      {
        label: "Consultas",
        data: dados.map(d => d.totalConsultas),
        backgroundColor: "royalblue"
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Consultas por Especialidade"
      }
    }
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Relatório de Consultas por Especialidade</Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Bar data={chartData} options={chartOptions} />
        </Paper>
        <Button variant="contained" onClick={exportarCSV}>
          Exportar CSV
        </Button>
      </Box>
    </Layout>
  );
};

export default RelatorioConsultasPorEspecialidadesPage;

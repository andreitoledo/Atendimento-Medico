import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Box, Typography, Paper } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const DashboardFinanceiroPage = () => {
  const [dados, setDados] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const inicio = "2025-04-10";
        const fim = "2025-05-10";
        const url = `https://localhost:44327/api/Relatorios/total-faturado?inicio=${inicio}&fim=${fim}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setDados(data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, [token]);

  const dias = dados.map((d) => new Date(d.dia).toLocaleDateString("pt-BR"));
  const totais = dados.map((d) => d.total);

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Dashboard Financeiro
        </Typography>

        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Total Faturado por Dia
          </Typography>
          <BarChart
            xAxis={[{ data: dias, scaleType: "band" }]}
            series={[{ data: totais, label: "Total (R$)" }]}
            height={300}
          />
        </Paper>
      </Box>
    </Layout>
  );
};

export default DashboardFinanceiroPage;

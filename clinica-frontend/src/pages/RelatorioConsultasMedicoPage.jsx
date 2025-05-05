import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody
} from "@mui/material";

const RelatorioConsultasMedicoPage = () => {
  const [dados, setDados] = useState([]);
  const token = localStorage.getItem("token");

  const carregarRelatorio = async () => {
    try {
      const res = await fetch("https://localhost:44327/api/Relatorios/consultas-por-medico", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const resultado = await res.json();
        setDados(resultado);
      }
    } catch (err) {
      console.error("Erro ao buscar relatório:", err);
    }
  };

  useEffect(() => {
    carregarRelatorio();
  }, []);

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Relatório de Consultas por Médico</Typography>

        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Médico</TableCell>
                <TableCell>Especialidade</TableCell>
                <TableCell align="right">Total de Consultas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dados.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nomeMedico}</TableCell>
                  <TableCell>{item.especialidade || "Não informado"}</TableCell>
                  <TableCell align="right">{item.totalConsultas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Layout>
  );
};

export default RelatorioConsultasMedicoPage;

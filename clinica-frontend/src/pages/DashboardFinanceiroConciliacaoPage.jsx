import React, { useState } from 'react';
import Layout from "../components/Layout";
import {
  Box, Typography, TextField, MenuItem, Button, Grid, Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

export default function DashboardFinanceiroConciliacaoPage() {
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    formaPagamento: '',
    statusPagamento: '',
    medicoId: '',
    pacienteId: ''
  });

  const [resultados, setResultados] = useState([]);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const buscar = async () => {
    const res = await fetch("https://localhost:44327/api/financeiro/faturamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...filtros,
        medicoId: filtros.medicoId || null,
        pacienteId: filtros.pacienteId || null,
        dataInicio: filtros.dataInicio || null,
        dataFim: filtros.dataFim || null
      })
    });

    const data = await res.json();
    setResultados(data);
  };

  const conciliar = async (id) => {
    const res = await fetch(`https://localhost:44327/api/pagamento/conciliar/faturamento/${id}`, {
      method: "POST"
    });
    const data = await res.json();
    alert(data.mensagem);
    buscar();
  };

  const exportarCSV = () => {
    const csv = [
      ["ID", "Paciente", "Médico", "Data", "Valor", "Forma", "Status"],
      ...resultados.map(r => [
        r.id, r.paciente, r.medico, dayjs(r.data).format("DD/MM/YYYY"),
        r.valor.toFixed(2), r.formaPagamento, r.statusPagamento
      ])
    ].map(linha => linha.join(";")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faturamentos.csv";
    a.click();
  };

  const total = resultados.reduce((sum, r) => sum + r.valor, 0);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "paciente", headerName: "Paciente", width: 180 },
    { field: "medico", headerName: "Médico", width: 180 },
    {
      field: "data",
      headerName: "Data",
      width: 110,
      valueFormatter: p => dayjs(p.value).format("DD/MM/YYYY")
    },
    {
      field: "valor",
      headerName: "Valor (R$)",
      width: 120,
      renderCell: (params) => `R$ ${parseFloat(params.row.valor).toFixed(2)}`
    },
    { field: "formaPagamento", headerName: "Forma", width: 120 },
    { field: "statusPagamento", headerName: "Status", width: 130 },

    {
      field: "acoes",
      headerName: "Ações",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isPix = params.row.formaPagamento === "Pix";
        const isAguardando = params.row.statusPagamento === "Aguardando";

        // Recibo de pagamento
        const handleAbrirRecibo = async () => {
          const url = `https://localhost:44327/api/Recibo/${params.row.id}/pdf`;
          const response = await fetch(url);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
        };

        const gerarRecibo = async (id) => {
          const res = await fetch(`https://localhost:44327/api/Recibo/faturamento/${id}/pdf`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
        
          if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
          } else {
            alert("Erro ao gerar recibo");
          }
        };
        


        return (
          <Box display="flex" gap={1}>
            {isPix && isAguardando && (
              <Button size="small" onClick={() => conciliar(params.row.id)}>
                Conciliar Pix
              </Button>
            )}
            <Button size="small" onClick={() => gerarRecibo(params.row.id)}>
              Recibo
            </Button>
          </Box>
        );
      }
    }
  ];


  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Dashboard Financeiro</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
              <TextField
                label="Início"
                type="date"
                name="dataInicio"
                value={filtros.dataInicio}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Fim"
                type="date"
                name="dataFim"
                value={filtros.dataFim}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Forma"
                name="formaPagamento"
                value={filtros.formaPagamento}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="Pix">Pix</MenuItem>
                <MenuItem value="Cartao">Cartão</MenuItem>
                <MenuItem value="Dinheiro">Dinheiro</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Status"
                name="statusPagamento"
                value={filtros.statusPagamento}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Pago">Pago</MenuItem>
                <MenuItem value="Aguardando">Aguardando</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Médico ID"
                name="medicoId"
                value={filtros.medicoId}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Paciente ID"
                name="pacienteId"
                value={filtros.pacienteId}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={buscar} sx={{ mr: 2 }}>Buscar</Button>
              <Button variant="outlined" onClick={exportarCSV}>Exportar CSV</Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ height: 500, width: '100%' }}>
          <DataGrid rows={resultados} columns={columns} pageSize={8} />
        </Paper>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Total: R$ {total.toFixed(2)}
        </Typography>
      </Box>
    </Layout>
  );
}
import React, { useState } from 'react';
import {
  TextField, MenuItem, Button, Grid, Typography, Paper
} from '@mui/material';
import dayjs from 'dayjs';

export default function FinanceiroDashboard() {
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

  const buscarFaturamentos = async () => {
    const response = await fetch('https://localhost:44327/api/financeiro/faturamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...filtros,
        medicoId: filtros.medicoId || null,
        pacienteId: filtros.pacienteId || null,
        dataInicio: filtros.dataInicio || null,
        dataFim: filtros.dataFim || null
      })
    });
    const data = await response.json();
    setResultados(data);
  };

  const conciliarPagamento = async (faturamentoId) => {
    const response = await fetch(`https://localhost:44327/api/pagamento/conciliar/faturamento/${faturamentoId}`, {
      method: 'POST'
    });
    const data = await response.json();
    alert(data.mensagem);
    buscarFaturamentos();
  };

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Dashboard Financeiro</Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <TextField
            label="Data Início"
            name="dataInicio"
            type="date"
            value={filtros.dataInicio}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="Data Fim"
            name="dataFim"
            type="date"
            value={filtros.dataFim}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            select
            label="Forma de Pagamento"
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
        <Grid item xs={6} md={3}>
          <TextField
            select
            label="Status Pagamento"
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
        <Grid item xs={6} md={3}>
          <TextField
            label="ID Médico"
            name="medicoId"
            value={filtros.medicoId}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="ID Paciente"
            name="pacienteId"
            value={filtros.pacienteId}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={buscarFaturamentos}>Buscar</Button>
        </Grid>
      </Grid>

      <div style={{ marginTop: 30 }}>
        <Typography variant="subtitle1">Resultados:</Typography>
        {resultados.length === 0 && <Typography>Nenhum resultado.</Typography>}
        {resultados.map((item) => (
          <Paper key={item.id} style={{ padding: 10, marginTop: 10 }}>
            <Typography><strong>Paciente:</strong> {item.paciente}</Typography>
            <Typography><strong>Médico:</strong> {item.medico}</Typography>
            <Typography><strong>Data:</strong> {dayjs(item.data).format('DD/MM/YYYY')}</Typography>
            <Typography><strong>Valor:</strong> R$ {item.valor.toFixed(2)}</Typography>
            <Typography><strong>Forma:</strong> {item.formaPagamento}</Typography>
            <Typography><strong>Status:</strong> {item.statusPagamento}</Typography>

            {item.formaPagamento === "Pix" && item.statusPagamento === "Aguardando" && (
              <Button
                variant="outlined"
                color="primary"
                style={{ marginTop: 10 }}
                onClick={() => conciliarPagamento(item.id)}
              >
                Confirmar Pagamento Pix
              </Button>
            )}
          </Paper>
        ))}
      </div>
    </Paper>
  );
}
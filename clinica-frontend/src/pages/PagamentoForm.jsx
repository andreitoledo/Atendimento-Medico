import React, { useState } from 'react';
import {
  TextField, MenuItem, Button, Typography, Paper, Grid
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';

export default function PagamentoForm() {
  const [form, setForm] = useState({
    agendamentoId: '',
    pacienteId: '',
    valor: '',
    formaPagamento: '',
    descricao: ''
  });
  const [resposta, setResposta] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const simularPagamento = async () => {
    const response = await fetch('https://localhost:44327/api/Pagamento/simular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setResposta(data);
  };

  return (
    <Paper elevation={3} style={{ padding: 20, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>Simular Pagamento</Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Agendamento ID"
            name="agendamentoId"
            fullWidth
            value={form.agendamentoId}
            onChange={handleChange}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Paciente ID"
            name="pacienteId"
            fullWidth
            value={form.pacienteId}
            onChange={handleChange}
            type="number"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Valor"
            name="valor"
            fullWidth
            value={form.valor}
            onChange={handleChange}
            type="number"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            label="Forma de Pagamento"
            name="formaPagamento"
            fullWidth
            value={form.formaPagamento}
            onChange={handleChange}
          >
            <MenuItem value="Pix">Pix</MenuItem>
            <MenuItem value="Cartao">Cartão</MenuItem>
            <MenuItem value="Dinheiro">Dinheiro</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descrição"
            name="descricao"
            fullWidth
            value={form.descricao}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={simularPagamento}>Simular Pagamento</Button>
        </Grid>
      </Grid>

      {resposta && (
        <div style={{ marginTop: 30 }}>
          <Typography variant="subtitle1">Pagamento Simulado:</Typography>
          <Typography>ID: {resposta.id}</Typography>
          <Typography>Status: {resposta.statusPagamento}</Typography>
          <Typography>Transação: {resposta.codigoTransacao}</Typography>

          {form.formaPagamento === "Pix" && (
            <div style={{ marginTop: 20 }}>
              <Typography>QR Code:</Typography>
              <QRCodeCanvas value={resposta.codigoTransacao} size={180} />
            </div>
          )}
        </div>
      )}
    </Paper>
  );
}

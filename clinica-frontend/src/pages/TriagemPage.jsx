import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, CircularProgress, Container, Paper
} from '@mui/material';
import Layout from '../components/Layout';

const TriagemPage = () => {
  const [agendamentoId, setAgendamentoId] = useState('');
  const [triagem, setTriagem] = useState({
    pressaoArterial: '',
    frequenciaCardiaca: '',
    temperatura: '',
    saturacaoOxigenio: '',
    peso: '',
    altura: '',
    imc: '',
    queixaInicial: '',
    prioridade: 'Normal'
  });
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('https://localhost:44327/api/Recepcao/hoje', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAgendamentos(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setTriagem({ ...triagem, [e.target.name]: e.target.value });
  };

  const calcularIMC = () => {
    const altura = parseFloat(triagem.altura);
    const peso = parseFloat(triagem.peso);
    if (altura && peso) {
      const imc = peso / (altura * altura);
      setTriagem({ ...triagem, imc: imc.toFixed(2) });
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...triagem,
      agendamentoId: parseInt(agendamentoId),
      dataTriagem: new Date().toISOString()
    };

    const response = await fetch('https://localhost:44327/api/Triagem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Triagem registrada com sucesso!');
      setTriagem({
        pressaoArterial: '',
        frequenciaCardiaca: '',
        temperatura: '',
        saturacaoOxigenio: '',
        peso: '',
        altura: '',
        imc: '',
        queixaInicial: '',
        prioridade: 'Normal'
      });
      setAgendamentoId('');
    } else {
      alert('Erro ao registrar triagem');
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Registrar Triagem</Typography>

          {loading ? <CircularProgress /> : (
            <TextField
              fullWidth select
              label="Agendamento"
              value={agendamentoId}
              onChange={(e) => setAgendamentoId(e.target.value)}
              margin="normal"
            >
              {agendamentos.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.pacienteNome} - {new Date(a.dataConsulta).toLocaleString('pt-BR')}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField fullWidth label="Pressão Arterial" name="pressaoArterial" value={triagem.pressaoArterial} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Frequência Cardíaca" name="frequenciaCardiaca" value={triagem.frequenciaCardiaca} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Temperatura" name="temperatura" value={triagem.temperatura} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Saturação de Oxigênio" name="saturacaoOxigenio" value={triagem.saturacaoOxigenio} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Peso (kg)" name="peso" value={triagem.peso} onChange={handleChange} margin="normal" onBlur={calcularIMC} />
          <TextField fullWidth label="Altura (m)" name="altura" value={triagem.altura} onChange={handleChange} margin="normal" onBlur={calcularIMC} />
          <TextField fullWidth label="IMC" name="imc" value={triagem.imc} margin="normal" disabled />
          <TextField fullWidth multiline rows={3} label="Queixa Inicial" name="queixaInicial" value={triagem.queixaInicial} onChange={handleChange} margin="normal" />
          <TextField fullWidth select label="Prioridade" name="prioridade" value={triagem.prioridade} onChange={handleChange} margin="normal">
            <MenuItem value="Baixa">Baixa</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Alta">Alta</MenuItem>
            <MenuItem value="Crítica">Crítica</MenuItem>
          </TextField>

          <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
            Salvar Triagem
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
};

export default TriagemPage;
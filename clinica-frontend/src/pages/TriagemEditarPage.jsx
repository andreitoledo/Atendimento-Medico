import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, TextField, Button, MenuItem, Container
} from "@mui/material";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";

const TriagemEditarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [triagem, setTriagem] = useState({
    pressaoArterial: "",
    frequenciaCardiaca: "",
    temperatura: "",
    saturacaoOxigenio: "",
    peso: "",
    altura: "",
    imc: "",
    queixaInicial: "",
    prioridade: "Normal"
  });

  useEffect(() => {
    const fetchTriagem = async () => {
      const res = await fetch(`https://localhost:44327/api/Triagem/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTriagem(data);
    };

    fetchTriagem();
  }, [id, token]);

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
    const res = await fetch(`https://localhost:44327/api/Triagem/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(triagem)
    });

    if (res.ok) {
      alert("Triagem atualizada com sucesso.");
      navigate("/triagem");
    } else {
      alert("Erro ao atualizar triagem.");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Editar Triagem</Typography>

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
            Salvar Alterações
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
};

export default TriagemEditarPage;

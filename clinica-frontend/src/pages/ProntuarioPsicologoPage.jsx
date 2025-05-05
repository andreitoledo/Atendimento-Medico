import React, { useEffect, useState } from "react";
import {
  Box, TextField, Button, Typography, Paper, Divider
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const ProntuarioPsicologoPage = () => {
  const { id } = useParams(); // AgendamentoId
  const token = localStorage.getItem("token");
  const [prontuario, setProntuario] = useState(null);
  const [form, setForm] = useState({
    crp: "",
    queixaPrincipal: "",
    objetivosTerapia: "",
    historicoProblema: "",
    historiaDeVida: "",
    resultadosAvaliacoes: "",
    evolucaoAtendimento: "",
    encaminhamentos: "",
    encerramento: "",
    documentosAnexos: ""
  });
  const navigate = useNavigate();

  const carregarProntuario = async () => {
    const res = await fetch("https://localhost:44327/api/ProntuarioPsicologo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      const existente = data.find(p => p.agendamentoId === parseInt(id));
      if (existente) {
        setProntuario(existente);
        setForm({ ...existente });
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    const method = prontuario ? "PUT" : "POST";
    const url = prontuario
      ? `https://localhost:44327/api/ProntuarioPsicologo/${prontuario.id}`
      : `https://localhost:44327/api/ProntuarioPsicologo`;

    const payload = {
      ...form,
      agendamentoId: parseInt(id)
    };

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Prontuário salvo com sucesso!");
      navigate("/consultas");
    } else {
      alert("Erro ao salvar prontuário.");
    }
  };

  const renderField = (label, name, multiline = true) => (
    <TextField
      label={label}
      name={name}
      value={form[name] || ""}
      onChange={handleChange}
      fullWidth
      multiline={multiline}
      minRows={multiline ? 2 : 1}
      sx={{ mb: 2 }}
    />
  );

  useEffect(() => {
    carregarProntuario();
  }, []);

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Prontuário - Psicólogo</Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Dados da Sessão</Typography>
          <Divider sx={{ mb: 2 }} />
          {renderField("CRP", "crp", false)}
          {renderField("Queixa Principal", "queixaPrincipal")}
          {renderField("Objetivos da Terapia", "objetivosTerapia")}
          {renderField("Histórico do Problema", "historicoProblema")}
          {renderField("História de Vida", "historiaDeVida")}
          {renderField("Resultados das Avaliações", "resultadosAvaliacoes")}
          {renderField("Evolução do Atendimento", "evolucaoAtendimento")}
          {renderField("Encaminhamentos", "encaminhamentos")}
          {renderField("Encerramento", "encerramento")}
          {renderField("Documentos Anexos", "documentosAnexos")}

          <Box mt={2}>
            <Button variant="contained" onClick={handleSalvar}>Salvar Prontuário</Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ProntuarioPsicologoPage;

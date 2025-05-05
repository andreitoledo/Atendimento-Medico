import React, { useEffect, useState } from "react";
import {
  Box, TextField, Button, Typography, Paper, Divider
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const ProntuarioPsiquiatraPage = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [prontuario, setProntuario] = useState(null);
  const [form, setForm] = useState({
    queixaPrincipal: "",
    duracaoSintomas: "",
    impactoVida: "",
    historiaDoencaAtual: "",
    tratamentosAnteriores: "",
    historicoMedico: "",
    historicoPsiquiatrico: "",
    historicoFamiliar: "",
    historiaPessoalSocial: "",
    exameEstadoMental: "",
    diagnostico: "",
    cid10: "",
    planoTerapeutico: "",
    evolucaoClinica: "",
    prescricao: "",
    solicitacaoExames: "",
    consentimentos: ""
  });

  const navigate = useNavigate();

  const carregarProntuario = async () => {
    const res = await fetch("https://localhost:44327/api/ProntuarioPsiquiatra", {
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
      ? `https://localhost:44327/api/ProntuarioPsiquiatra/${prontuario.id}`
      : `https://localhost:44327/api/ProntuarioPsiquiatra`;

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
        <Typography variant="h5" gutterBottom>Prontuário - Psiquiatra</Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">1. Queixa e Histórico</Typography>
          <Divider sx={{ mb: 2 }} />
          {renderField("Queixa Principal", "queixaPrincipal")}
          {renderField("Duração dos Sintomas", "duracaoSintomas")}
          {renderField("Impacto na Vida", "impactoVida")}
          {renderField("História da Doença Atual", "historiaDoencaAtual")}
          {renderField("Tratamentos Anteriores", "tratamentosAnteriores")}
          {renderField("Histórico Médico", "historicoMedico")}
          {renderField("Histórico Psiquiátrico", "historicoPsiquiatrico")}
          {renderField("Histórico Familiar", "historicoFamiliar")}
          {renderField("História Pessoal e Social", "historiaPessoalSocial")}
          {renderField("Exame do Estado Mental", "exameEstadoMental")}

          <Typography variant="h6" sx={{ mt: 3 }}>2. Diagnóstico e Conduta</Typography>
          <Divider sx={{ mb: 2 }} />
          {renderField("Diagnóstico", "diagnostico")}
          {renderField("CID-10", "cid10")}
          {renderField("Plano Terapêutico", "planoTerapeutico")}
          {renderField("Evolução Clínica", "evolucaoClinica")}
          {renderField("Prescrição", "prescricao")}
          {renderField("Solicitação de Exames", "solicitacaoExames")}
          {renderField("Consentimentos", "consentimentos")}

          <Box mt={2}>
            <Button variant="contained" onClick={handleSalvar}>Salvar Prontuário</Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ProntuarioPsiquiatraPage;

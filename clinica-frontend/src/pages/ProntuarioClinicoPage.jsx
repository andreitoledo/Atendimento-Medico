import React, { useEffect, useState } from "react";
import {
  Box, TextField, Button, Typography, Paper, Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const ProntuarioClinicoPage = () => {
  const { id } = useParams(); // AgendamentoId
  const token = localStorage.getItem("token");
  const [prontuario, setProntuario] = useState(null);
  const [form, setForm] = useState({
    queixaPrincipal: "",
    historiaDoencaAtual: "",
    historicoMedico: "",
    historicoFamiliar: "",
    historicoSocial: "",
    historicoOcupacional: "",
    sinaisVitais: "",
    exameFisico: "",
    hipotesesDiagnosticas: "",
    solicitacaoExames: "",
    prescricao: "",
    planoTerapeutico: "",
    evolucaoClinica: "",
    consentimentos: "",
    observacoesEncerramento: "",
  });

  const navigate = useNavigate();

  const carregarProntuario = async () => {
    const res = await fetch("https://localhost:44327/api/ProntuarioClinico", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      const existente = data.find((p) => p.agendamentoId === parseInt(id));
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
      ? `https://localhost:44327/api/ProntuarioClinico/${prontuario.id}`
      : `https://localhost:44327/api/ProntuarioClinico`;

    const payload = {
      ...form,
      agendamentoId: parseInt(id),
    };

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Prontuário salvo com sucesso!");
      navigate("/consultas");
    } else {
      alert("Erro ao salvar prontuário.");
    }
  };

  useEffect(() => {
    carregarProntuario();
  }, []);

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

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Prontuário Clínico Geral
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">1. Queixa e História</Typography>
          <Divider sx={{ mb: 2 }} />
          {renderField("Queixa Principal", "queixaPrincipal")}
          {renderField("História da Doença Atual", "historiaDoencaAtual")}
          {renderField("Histórico Médico", "historicoMedico")}
          {renderField("Histórico Familiar", "historicoFamiliar")}
          {renderField("Histórico Social", "historicoSocial")}
          {renderField("Histórico Ocupacional", "historicoOcupacional")}

          <Typography variant="h6" sx={{ mt: 3 }}>
            2. Exames e Diagnóstico
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {renderField("Sinais Vitais", "sinaisVitais")}
          {renderField("Exame Físico", "exameFisico")}
          {renderField("Hipóteses Diagnósticas", "hipotesesDiagnosticas")}
          {renderField("Solicitação de Exames", "solicitacaoExames")}

          <Typography variant="h6" sx={{ mt: 3 }}>
            3. Conduta e Encerramento
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {renderField("Prescrição", "prescricao")}
          {renderField("Plano Terapêutico", "planoTerapeutico")}
          {renderField("Evolução Clínica", "evolucaoClinica")}
          {renderField("Consentimentos", "consentimentos")}
          {renderField("Observações de Encerramento", "observacoesEncerramento")}

          <Box mt={3}>
            <Button variant="contained" onClick={handleSalvar}>
              Salvar Prontuário
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ProntuarioClinicoPage;

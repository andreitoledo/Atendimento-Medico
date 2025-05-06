import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const FaturamentosPage = () => {
  const [faturamentos, setFaturamentos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoId, setAgendamentoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [statusPagamento, setStatusPagamento] = useState("");
  const [codigoTransacao, setCodigoTransacao] = useState("");
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFaturamentos();
    fetchAgendamentos();
  }, []);

  const fetchFaturamentos = async () => {
    const res = await fetch("https://localhost:44327/api/Faturamento", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFaturamentos(data);
  };

  const fetchAgendamentos = async () => {
    const res = await fetch("https://localhost:44327/api/Agendamento", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const agendamentosComCheckin = data.filter((a) => a.checkIn === true);
    setAgendamentos(agendamentosComCheckin);
  };

  const resetForm = () => {
    setAgendamentoId("");
    setDescricao("");
    setValor("");
    setFormaPagamento("");
    setStatusPagamento("");
    setCodigoTransacao("");
    setEditingId(null);
  };

  const handleSalvar = async () => {
    if (!agendamentoId || !valor || !formaPagamento) return;

    const agendamento = agendamentos.find(a => a.id === parseInt(agendamentoId));
    const payload = {
      agendamentoId: parseInt(agendamentoId),
      pacienteId: agendamento.pacienteId,
      data: new Date().toISOString(),
      valor: parseFloat(valor),
      formaPagamento,
      descricao,
      statusPagamento: statusPagamento || "Pendente",
      codigoTransacao
    };

    const url = editingId
      ? `https://localhost:44327/api/Faturamento/${editingId}`
      : "https://localhost:44327/api/Faturamento";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      resetForm();
      fetchFaturamentos();
    } else {
      const erro = await res.text();
      console.error("Erro ao salvar:", erro);
      alert("Erro ao salvar faturamento");
    }
  };

  const handleEdit = (f) => {
    setAgendamentoId(f.agendamentoId);
    setDescricao(f.descricao);
    setValor(f.valor);
    setFormaPagamento(f.formaPagamento);
    setStatusPagamento(f.statusPagamento || "");
    setCodigoTransacao(f.codigoTransacao || "");
    setEditingId(f.id);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Faturamento/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) fetchFaturamentos();
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Faturamentos</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Select
            value={agendamentoId}
            onChange={(e) => setAgendamentoId(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Selecione o agendamento</MenuItem>
            {agendamentos.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.nomePaciente} com {a.nomeMedico}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth sx={{ mb: 2 }}
          />
          <TextField
            label="Valor"
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            fullWidth sx={{ mb: 2 }}
          />

          <Select
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            displayEmpty
            fullWidth sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Forma de Pagamento</MenuItem>
            <MenuItem value="Dinheiro">Dinheiro</MenuItem>
            <MenuItem value="Pix">Pix</MenuItem>
            <MenuItem value="Cartão">Cartão</MenuItem>
            <MenuItem value="Outros">Outros</MenuItem>
          </Select>

          <Select
            value={statusPagamento}
            onChange={(e) => setStatusPagamento(e.target.value)}
            displayEmpty
            fullWidth sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Status do Pagamento</MenuItem>
            <MenuItem value="Pendente">Pendente</MenuItem>
            <MenuItem value="Aguardando">Aguardando</MenuItem>
            <MenuItem value="Pago">Pago</MenuItem>
          </Select>

          <TextField
            label="Código da Transação"
            value={codigoTransacao}
            onChange={(e) => setCodigoTransacao(e.target.value)}
            fullWidth sx={{ mb: 2 }}
          />


          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={handleSalvar}>Salvar</Button>
            <Button onClick={resetForm}>Cancelar</Button>
          </Box>
        </Paper>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Médico</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Valor (R$)</TableCell>
                <TableCell>Forma</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faturamentos.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.id}</TableCell>
                  <TableCell>{f.pacienteNome}</TableCell>
                  <TableCell>{f.medicoNome}</TableCell>
                  <TableCell>{new Date(f.data).toLocaleString()}</TableCell>
                  <TableCell>{f.valor}</TableCell>
                  <TableCell>{f.formaPagamento}</TableCell>
                  <TableCell sx={{ display: "flex", gap: 1 }}>
                    <IconButton onClick={() => handleEdit(f)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(f.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Layout>
  );
};

export default FaturamentosPage;
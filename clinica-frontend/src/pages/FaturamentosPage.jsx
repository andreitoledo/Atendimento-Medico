import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button, Select,
  MenuItem, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, InputLabel, FormControl
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const FaturamentosPage = () => {
  const [faturamentos, setFaturamentos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [agendamentoId, setAgendamentoId] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [descricao, setDescricao] = useState("");

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
    setAgendamentos(data);
  };

  const resetForm = () => {
    setAgendamentoId("");
    setData("");
    setValor("");
    setFormaPagamento("");
    setDescricao("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!agendamentoId || !data || !valor || !formaPagamento || !descricao) return;

    const agendamento = agendamentos.find(a => a.id === parseInt(agendamentoId));
    if (!agendamento) return;

    const payload = {
      agendamentoId: parseInt(agendamentoId),
      pacienteId: agendamento.pacienteId,
      data,
      valor: parseFloat(valor),
      formaPagamento,
      descricao,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `https://localhost:44327/api/Faturamento/${editingId}`
      : `https://localhost:44327/api/Faturamento`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchFaturamentos();
      resetForm();
    }
  };

  const handleEdit = (f) => {
    setEditingId(f.id);
    setAgendamentoId(f.agendamentoId);
    setData(f.data.slice(0, 16)); // yyyy-MM-ddTHH:mm
    setValor(f.valor);
    setFormaPagamento(f.formaPagamento);
    setDescricao(f.descricao);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Faturamento/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchFaturamentos();
      resetForm();
    }
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Faturamentos</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Agendamento</InputLabel>
            <Select
              value={agendamentoId}
              label="Agendamento"
              onChange={(e) => setAgendamentoId(e.target.value)}
            >
              {agendamentos.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {`${a.nomePaciente} com ${a.nomeMedico}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Data"
            type="datetime-local"
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <TextField
            label="Valor"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <TextField
            label="Forma de Pagamento"
            fullWidth
            sx={{ mb: 2 }}
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
          />
          <TextField
            label="Descrição"
            fullWidth
            sx={{ mb: 2 }}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <Button variant="contained" onClick={handleSubmit}>
            {editingId ? "Atualizar" : "Salvar"}
          </Button>
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
                <TableCell>Descrição</TableCell>
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
                  <TableCell>{f.valor.toFixed(2)}</TableCell>
                  <TableCell>{f.formaPagamento}</TableCell>
                  <TableCell>{f.descricao}</TableCell>
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

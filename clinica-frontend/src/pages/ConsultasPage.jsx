import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton, MenuItem, Select
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ConsultasPage = () => {
  const [consultas, setConsultas] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoId, setAgendamentoId] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [prescricoes, setPrescricoes] = useState([{ medicamento: "", posologia: "" }]);
  const [exames, setExames] = useState([{ nome: "", observacoes: "" }]);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchConsultas = async () => {
    const res = await fetch("https://localhost:44327/api/Consulta", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setConsultas(data);
  };

  const fetchAgendamentos = async () => {
    const res = await fetch("https://localhost:44327/api/Agendamento", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAgendamentos(data);
  };

  useEffect(() => {
    fetchConsultas();
    fetchAgendamentos();
  }, []);

  const handleAdd = async () => {
    if (!agendamentoId || !dataConsulta || !diagnostico) return;

    const payload = {
      agendamentoId: parseInt(agendamentoId),
      dataConsulta,
      diagnostico,
      prescricoes,
      examesSolicitados: exames,
    };

    const method = editingId ? "PUT" : "POST";
    const url = `https://localhost:44327/api/Consulta${editingId ? "/" + editingId : ""}`;

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
      fetchConsultas();
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setAgendamentoId(c.agendamentoId);
    setDataConsulta(c.dataConsulta?.substring(0, 16)); // para input type="datetime-local"
    setDiagnostico(c.diagnostico);
    setPrescricoes(c.prescricoes || [{ medicamento: "", posologia: "" }]);
    setExames(c.examesSolicitados || [{ nome: "", observacoes: "" }]);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Consulta/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchConsultas();
  };

  const resetForm = () => {
    setAgendamentoId("");
    setDataConsulta("");
    setDiagnostico("");
    setPrescricoes([{ medicamento: "", posologia: "" }]);
    setExames([{ nome: "", observacoes: "" }]);
    setEditingId(null);
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Consultas</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Select
            value={agendamentoId}
            onChange={(e) => setAgendamentoId(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Selecione o agendamento</MenuItem>
            {agendamentos.map(a => (
              <MenuItem key={a.id} value={a.id}>
                {a.nomePaciente} com {a.nomeMedico} - {new Date(a.dataConsulta).toLocaleString()}
              </MenuItem>
            ))}
          </Select>

          <TextField label="Data da Consulta" type="datetime-local" value={dataConsulta}
            onChange={(e) => setDataConsulta(e.target.value)}
            fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField label="Diagnóstico" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} fullWidth sx={{ mb: 2 }} />

          <Typography variant="subtitle1">Prescrições</Typography>
          {prescricoes.map((p, i) => (
            <Box key={i} display="flex" gap={2} sx={{ mb: 1 }}>
              <TextField label="Medicamento" value={p.medicamento}
                onChange={(e) => {
                  const list = [...prescricoes];
                  list[i].medicamento = e.target.value;
                  setPrescricoes(list);
                }} fullWidth />
              <TextField label="Posologia" value={p.posologia}
                onChange={(e) => {
                  const list = [...prescricoes];
                  list[i].posologia = e.target.value;
                  setPrescricoes(list);
                }} fullWidth />
            </Box>
          ))}
          <Button onClick={() => setPrescricoes([...prescricoes, { medicamento: "", posologia: "" }])}>+ Prescrição</Button>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Exames Solicitados</Typography>
          {exames.map((e, i) => (
            <Box key={i} display="flex" gap={2} sx={{ mb: 1 }}>
              <TextField label="Exame" value={e.nome}
                onChange={(evt) => {
                  const list = [...exames];
                  list[i].nome = evt.target.value;
                  setExames(list);
                }} fullWidth />
              <TextField label="Observações" value={e.observacoes}
                onChange={(evt) => {
                  const list = [...exames];
                  list[i].observacoes = evt.target.value;
                  setExames(list);
                }} fullWidth />
            </Box>
          ))}
          <Button onClick={() => setExames([...exames, { nome: "", observacoes: "" }])}>+ Exame</Button>

          <Button variant="contained" onClick={handleAdd} sx={{ mt: 2 }}>
            {editingId ? "Atualizar Consulta" : "Salvar Consulta"}
          </Button>
        </Paper>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Agendamento</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Diagnóstico</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultas.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.agendamento?.nomePaciente} com {c.agendamento?.nomeMedico}</TableCell>
                  <TableCell>{new Date(c.dataConsulta).toLocaleString()}</TableCell>
                  <TableCell>{c.diagnostico}</TableCell>
                  <TableCell sx={{ display: "flex", gap: 1 }}>
                    <IconButton onClick={() => handleEdit(c)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(c.id)}><DeleteIcon /></IconButton>
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

export default ConsultasPage;

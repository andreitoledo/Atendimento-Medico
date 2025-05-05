import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AgendamentosPage = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicoId, setMedicoId] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [linkVideo, setLinkVideo] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchAgendamentos = async () => {
    let url = "https://localhost:44327/api/Agendamento";
    if (statusFiltro) url += `?status=${statusFiltro}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAgendamentos(data);
  };

  const fetchMedicos = async () => {
    const res = await fetch("https://localhost:44327/api/Medico", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMedicos(data);
  };

  const fetchPacientes = async () => {
    const res = await fetch("https://localhost:44327/api/Paciente", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    // Agrupar pacientes únicos pelo ID
  const pacientesUnicos = Array.from(
    new Map(data.map(p => [p.id, p])).values()
  );

    setPacientes(pacientesUnicos);
  };

  useEffect(() => {
    fetchAgendamentos();
    fetchMedicos();
    fetchPacientes();
  }, []);

  const handleSubmit = async () => {
    if (!medicoId || !pacienteId || !dataConsulta || !plataforma) return;

    const agendamento = {
      medicoId,
      pacienteId,
      dataConsulta,
      plataforma,
      linkVideo
    };

    const url = editingId
      ? `https://localhost:44327/api/Agendamento/${editingId}`
      : "https://localhost:44327/api/Agendamento";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(agendamento)
    });

    if (res.ok) {
      resetForm();
      fetchAgendamentos();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Agendamento/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) fetchAgendamentos();
  };

  const handleEdit = (a) => {
    setMedicoId(a.medicoId);
    setPacienteId(a.pacienteId);
    setDataConsulta(a.dataConsulta.substring(0, 16)); // para input type="datetime-local"
    setPlataforma(a.plataforma);
    setLinkVideo(a.linkVideo);
    setEditingId(a.id);
  };

  const resetForm = () => {
    setMedicoId("");
    setPacienteId("");
    setDataConsulta("");
    setPlataforma("");
    setLinkVideo("");
    setEditingId(null);
  };

  // Função para realizar o check-in
  const handleCheckIn = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Agendamento/${id}/checkin`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) fetchAgendamentos();
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Agendamentos</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center" mb={2}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={statusFiltro}
                label="Status"
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="agendado">Agendado</MenuItem>
                <MenuItem value="realizado">Realizado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={fetchAgendamentos}>Filtrar</Button>
          </Box>


          <Select value={medicoId} onChange={e => setMedicoId(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="" disabled>Selecione o médico</MenuItem>
            {medicos.map(m => (
              <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
            ))}
          </Select>

          <Select value={pacienteId} onChange={e => setPacienteId(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="" disabled>Selecione o paciente</MenuItem>
            {pacientes.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
            ))}
          </Select>

          <TextField
            label="Data da Consulta"
            type="datetime-local"
            value={dataConsulta}
            onChange={e => setDataConsulta(e.target.value)}
            fullWidth sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <Select value={plataforma} onChange={e => setPlataforma(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="" disabled>Selecione a plataforma</MenuItem>
            <MenuItem value="WhatsApp">WhatsApp</MenuItem>
            <MenuItem value="Google Meet">Google Meet</MenuItem>
            <MenuItem value="Zoom">Zoom</MenuItem>
          </Select>

          <TextField
            label="Link da Vídeo"
            value={linkVideo}
            onChange={e => setLinkVideo(e.target.value)}
            fullWidth sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={handleSubmit}>
            {editingId ? "Atualizar" : "Agendar"}
          </Button>
          {editingId && <Button onClick={resetForm}>Cancelar</Button>}
        </Paper>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Médico</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Plataforma</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agendamentos.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>{a.nomeMedico}</TableCell>
                  <TableCell>{a.nomePaciente}</TableCell>
                  <TableCell>{new Date(a.dataConsulta).toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{a.plataforma}</TableCell>
                  <TableCell>{a.status}</TableCell>

                  <TableCell>{a.checkIn ? "Sim" : "Não"}</TableCell>
                  <TableCell sx={{ display: "flex", gap: 1 }}>
                    {!a.checkIn && (
                      <IconButton onClick={() => handleCheckIn(a.id)} title="Realizar Check-In">
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleEdit(a)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(a.id)}><DeleteIcon /></IconButton>
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

export default AgendamentosPage;

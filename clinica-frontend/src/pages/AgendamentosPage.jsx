
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button, Snackbar, Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Autocomplete from "@mui/material/Autocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import { MenuItem } from '@mui/material';


const AgendamentosPage = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicoId, setMedicoId] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [linkVideo, setLinkVideo] = useState("");
  const [status, setStatus] = useState("agendado");
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const token = localStorage.getItem("token");

  const fetchAgendamentos = async () => {
    const res = await fetch("https://localhost:44327/api/Agendamento", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAgendamentos(data);
    setFiltered(data);
  };

  const fetchMedicos = async () => {
    const res = await fetch("https://localhost:44327/api/Medico", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMedicos(await res.json());
  };

  const fetchPacientes = async () => {
    const res = await fetch("https://localhost:44327/api/Paciente", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const unicos = Array.from(new Map(data.map(p => [p.id, p])).values());
    setPacientes(unicos);
  };

  useEffect(() => {
    fetchAgendamentos();
    fetchMedicos();
    fetchPacientes();
  }, []);

  const handleSubmit = async () => {
    const payload = { medicoId, pacienteId, dataConsulta, plataforma, linkVideo, status };
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
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      fetchAgendamentos();
      resetForm();
      setSnackbar({
        open: true,
        message: editingId ? "Registro atualizado com sucesso" : "Registro criado com sucesso",
        severity: "success"
      });
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Agendamento/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchAgendamentos();
      setSnackbar({ open: true, message: "Registro excluído com sucesso", severity: "info" });
    }
  };

  const handleEdit = (a) => {
    setMedicoId(a.medicoId);
    setPacienteId(a.pacienteId);
    setDataConsulta(a.dataConsulta.substring(0, 16));
    setPlataforma(a.plataforma);
    setLinkVideo(a.linkVideo);
    setStatus(a.status);
    setEditingId(a.id);
  };

  const resetForm = () => {
    setMedicoId(""); setPacienteId(""); setDataConsulta(""); setPlataforma("");
    setLinkVideo(""); setEditingId(null); setStatus("agendado");
  };

  const handleCheckIn = async (id) => {
    await fetch(`https://localhost:44327/api/Agendamento/${id}/checkin`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    fetchAgendamentos();
  };

  // Grid consuta
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nomeMedico', headerName: 'Médico', width: 150 },
    { field: 'nomePaciente', headerName: 'Paciente', width: 150 },
    {
      field: 'dataConsulta',
      headerName: 'Data',
      width: 170,
      // valueFormatter: (params) =>
      //   new Date(params.value).toLocaleString("pt-BR")
    },
    { field: 'plataforma', headerName: 'Plataforma', width: 120 },
    { field: 'status', headerName: 'Status', width: 110 },
    {
      field: 'checkIn',
      headerName: 'Check-in',
      width: 100,
      renderCell: (params) => params.value ? "Sim" : "Não"
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 120,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {!params.row.checkIn && (
            <IconButton onClick={() => handleCheckIn(params.row.id)} title="Check-in">
              <CheckCircleIcon />
            </IconButton>
          )}
          <IconButton onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
        </Box>
      )
    }
  ];

  // Campos a serem preenchidos para Agendamento
  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Agendamentos</Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          {/* Data e hora da consulta */}
          <TextField label="Data Consulta" type="datetime-local" fullWidth sx={{ mb: 2 }}
            value={dataConsulta} onChange={(e) => setDataConsulta(e.target.value)}
            InputLabelProps={{ shrink: true }} />
          {/* Paciente a ser escolhido*/}
          <Autocomplete options={pacientes} value={pacientes.find(p => p.id === pacienteId) || null}
            getOptionLabel={(option) => `${option.nome} - ${option.email}`}
            onChange={(e, newValue) => setPacienteId(newValue?.id || "")}
            renderInput={(params) => <TextField {...params} label="Paciente" />}
            sx={{ mb: 2 }} />
          {/* Médico a ser escolhido*/}
          <Autocomplete options={medicos} value={medicos.find(m => m.id === medicoId) || null}
            getOptionLabel={(option) => option.nome}
            onChange={(e, newValue) => setMedicoId(newValue?.id || "")}
            renderInput={(params) => <TextField {...params} label="Médico" />}
            sx={{ mb: 2 }} />
          {/* Plataforma a ser escolhido */}         
          <TextField select label="Plataforma" fullWidth value={plataforma} onChange={(e) => setPlataforma(e.target.value)} sx={{ mb: 2 }}>
            <MenuItem value="WhatsApp">WhatsApp</MenuItem>
            <MenuItem value="Google Meet">Google Meet</MenuItem>
            <MenuItem value="Zoom">Zoom</MenuItem>
            <MenuItem value="Skype">Skype</MenuItem>
            <MenuItem value="Teams">Teams</MenuItem>
            <MenuItem value="Outros">Outros</MenuItem>
          </TextField>        
          {/* Link do video a ser inserido */}
          <TextField label="Link Vídeo" value={linkVideo}
            onChange={(e) => setLinkVideo(e.target.value)} fullWidth sx={{ mb: 2 }} />
          {/* Status do agendamento a ser escolhido */}
          <TextField select label="Status" fullWidth value={status} onChange={(e) => setStatus(e.target.value)} sx={{ mb: 2 }}>
            <MenuItem value="agendado">Agendado</MenuItem>
            <MenuItem value="realizado">Realizado</MenuItem>
            <MenuItem value="cancelado">Cancelado</MenuItem>
          </TextField>

          <Button variant="contained" onClick={handleSubmit}>
            {editingId ? "Atualizar" : "Agendar"}
          </Button>
          {editingId && <Button onClick={resetForm}>Cancelar</Button>}
        </Paper>

        <Paper sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default AgendamentosPage;

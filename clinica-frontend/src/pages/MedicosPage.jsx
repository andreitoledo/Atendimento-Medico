import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton, MenuItem, Select
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const MedicosPage = () => {
  const [medicos, setMedicos] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidadeId, setEspecialidadeId] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchMedicos = async () => {
    const res = await fetch("https://localhost:44327/api/Medico", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMedicos(data);
  };

  const fetchEspecialidades = async () => {
    const res = await fetch("https://localhost:44327/api/Especialidade", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEspecialidades(data);
  };

  useEffect(() => {
    fetchMedicos();
    fetchEspecialidades();
  }, []);

  const handleAdd = async () => {
    if (!nome || !email || !crm || !especialidadeId) return;

    const especialidadeSelecionada = especialidades.find(e => e.id == especialidadeId);
    const tituloEspecialidade = especialidadeSelecionada ? especialidadeSelecionada.titulo : "";

    if (editingId) {
      const res = await fetch(`https://localhost:44327/api/Medico/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          crm,
          especialidade: tituloEspecialidade
        })
      });

      if (res.ok) {
        setEditingId(null);
        setNome("");
        setEmail("");
        setCrm("");
        setEspecialidadeId("");
        fetchMedicos();
      }
      return;
    }

    try {
      const usuarioResponse = await fetch("https://localhost:44327/api/Usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          email,
          senha: "123456",
          tipo: "medico"
        })
      });

      if (!usuarioResponse.ok) throw new Error("Erro ao criar usuário");

      const usuarioCriado = await usuarioResponse.json();

      const medicoResponse = await fetch("https://localhost:44327/api/Medico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          usuarioId: usuarioCriado.id,
          crm,
          especialidade: tituloEspecialidade
        })
      });

      if (!medicoResponse.ok) throw new Error("Erro ao criar médico");

      setNome("");
      setEmail("");
      setCrm("");
      setEspecialidadeId("");
      fetchMedicos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch("https://localhost:44327/api/Medico/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchMedicos();
    }
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Médicos</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="CRM" value={crm} onChange={(e) => setCrm(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <Select
            value={especialidadeId}
            onChange={(e) => setEspecialidadeId(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Selecione a especialidade</MenuItem>
            {especialidades.map((e) => (
              <MenuItem key={e.id} value={e.id}>{e.titulo}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={handleAdd}>
            {editingId ? "Atualizar" : "Adicionar"}
          </Button>
        </Paper>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CRM</TableCell>
                <TableCell>Especialidade</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicos.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.id}</TableCell>
                  <TableCell>{m.nome}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.crm}</TableCell>
                  <TableCell>{m.especialidade}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(m.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                      setNome(m.nome);
                      setEmail(m.email);
                      setCrm(m.crm);
                      const esp = especialidades.find(e => e.titulo === m.especialidade);
                      setEspecialidadeId(esp ? esp.id : "");
                      setEditingId(m.id);
                    }}>
                      <EditIcon />
                    </IconButton>
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

export default MedicosPage;
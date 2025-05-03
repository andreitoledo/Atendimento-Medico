import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton, Select, MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const PacientesPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [genero, setGenero] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchPacientes = async () => {
    const res = await fetch("https://localhost:44327/api/Paciente", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPacientes(data);
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleAdd = async () => {
    if (!nome || !email || !cpf || !genero || !telefone || !endereco || !dataNascimento) return;

    if (editingId) {
      // Atualizar paciente
      await fetch(`https://localhost:44327/api/Paciente/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cpf,
          genero,
          telefone,
          endereco,
          dataNascimento,
        }),
      });

      // Atualizar usuário
      if (usuarioId) {
        await fetch(`https://localhost:44327/api/Usuario/${usuarioId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, email }),
        });
      }

      resetForm();
      fetchPacientes();
      return;
    }

    // Criação de usuário e paciente
    const usuarioRes = await fetch("https://localhost:44327/api/Usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        email,
        senha: "123456",
        tipo: "paciente",
      }),
    });

    if (!usuarioRes.ok) {
      console.error("Erro ao criar usuário");
      return;
    }

    const usuario = await usuarioRes.json();

    const pacienteRes = await fetch("https://localhost:44327/api/Paciente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuarioId: usuario.id,
        cpf,
        genero,
        telefone,
        endereco,
        dataNascimento,
      }),
    });

    if (pacienteRes.ok) {
      resetForm();
      fetchPacientes();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Paciente/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchPacientes();
    }
  };

  const handleEdit = (p) => {
    setNome(p.nome || "");
    setEmail(p.email || "");
    setCpf(p.cpf);
    setGenero(p.genero || "");
    setTelefone(p.telefone);
    setEndereco(p.endereco);
    setDataNascimento(p.dataNascimento?.substring(0, 10));
    setEditingId(p.id);
    setUsuarioId(p.usuario?.id || null);
  };

  const resetForm = () => {
    setNome("");
    setEmail("");
    setCpf("");
    setGenero("");
    setTelefone("");
    setEndereco("");
    setDataNascimento("");
    setEditingId(null);
    setUsuarioId(null);
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Pacientes</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <Select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Selecione o gênero</MenuItem>
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Feminino">Feminino</MenuItem>
            <MenuItem value="Outro">Outro</MenuItem>
          </Select>
          <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField
            label="Data de Nascimento"
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
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
                <TableCell>CPF</TableCell>
                <TableCell>Gênero</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pacientes.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.nome}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.cpf}</TableCell>
                  <TableCell>{p.genero}</TableCell>
                  <TableCell>{p.telefone}</TableCell>
                  <TableCell>{p.endereco}</TableCell>
                  <TableCell sx={{ display: "flex", gap: 1 }}>
                    <IconButton onClick={() => handleEdit(p)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(p.id)}>
                      <DeleteIcon />
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

export default PacientesPage;

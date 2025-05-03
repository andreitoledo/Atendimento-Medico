
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton, MenuItem, Select, Checkbox, FormControlLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchUsuarios = async () => {
    const res = await fetch("https://localhost:44327/api/Usuario", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleAdd = async () => {
    if (!nome || !email || (!editingId && !senha) || !tipo) return;

    const payload = {
      nome,
      email,
      tipo,
      ativo
    };
    if (editingId) {
      const res = await fetch(`https://localhost:44327/api/Usuario/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          email,
          senha: "123456", // <- necessário para o backend aceitar
          tipo,
          ativo,
        }),
      });
    
      if (res.ok) {
        resetForm();
        fetchUsuarios();
      } else {
        console.error("Erro ao atualizar usuário");
      }
      return;
    }
  }

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Usuario/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchUsuarios();
      resetForm();
    }
  };

  const handleEdit = (u) => {
    setNome(u.nome);
    setEmail(u.email);
    setTipo(u.tipo);
    setAtivo(u.ativo);
    setEditingId(u.id);
  };

  const resetForm = () => {
    setNome("");
    setEmail("");
    setSenha("");
    setTipo("");
    setAtivo(true);
    setEditingId(null);
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Usuários</Typography>
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
          {!editingId && (
            <TextField label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} fullWidth sx={{ mb: 2 }} />
          )}
          <Select value={tipo} onChange={(e) => setTipo(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="" disabled>Selecione o tipo</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="medico">Médico</MenuItem>
            <MenuItem value="paciente">Paciente</MenuItem>
          </Select>
          <FormControlLabel
            control={<Checkbox checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />}
            label="Ativo"
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
                <TableCell>Tipo</TableCell>
                <TableCell>Ativo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.nome}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.tipo}</TableCell>
                  <TableCell>{u.ativo ? "Sim" : "Não"}</TableCell>
                  <TableCell style={{ display: "flex", gap: 8 }}>
                    <IconButton onClick={() => handleEdit(u)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(u.id)}>
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

export default UsuariosPage;

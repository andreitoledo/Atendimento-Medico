import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton, MenuItem, Select,
  Checkbox, FormControlLabel, Snackbar, TablePagination
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
      senha: senha || "123456",
      tipo,
      ativo
    };

    const url = editingId
      ? `https://localhost:44327/api/Usuario/${editingId}`
      : "https://localhost:44327/api/Usuario";

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
      setSnackbar({ open: true, message: editingId ? "Usuário atualizado!" : "Usuário criado!" });
      resetForm();
      fetchUsuarios();
    } else {
      console.error("Erro ao salvar usuário");
      setSnackbar({ open: true, message: "Erro ao salvar usuário" });
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Usuario/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setSnackbar({ open: true, message: "Usuário excluído!" });
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

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    setPage(0);
  };

  const filteredUsuarios = usuarios.filter(u =>
    u.nome.toLowerCase().includes(search) ||
    u.email.toLowerCase().includes(search)
  );

  const pagedUsuarios = filteredUsuarios.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

        <TextField label="Buscar por nome/email" value={search} onChange={handleSearch} fullWidth sx={{ mb: 2 }} />

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
              {pagedUsuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.nome}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.tipo}</TableCell>
                  <TableCell>{u.ativo ? "Sim" : "Não"}</TableCell>
                  <TableCell style={{ display: "flex", gap: 8 }}>
                    <IconButton onClick={() => handleEdit(u)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(u.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredUsuarios.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          action={<IconButton onClick={() => setSnackbar({ ...snackbar, open: false })}><CloseIcon /></IconButton>}
        />
      </Box>
    </Layout>
  );
};

export default UsuariosPage;
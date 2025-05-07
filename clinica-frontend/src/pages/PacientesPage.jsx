
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box, Typography, Paper, TextField, Button, IconButton,
  Select, MenuItem, Snackbar, Alert, TablePagination
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [pageSize, setPageSize] = useState(10);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");

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
      await fetch(`https://localhost:44327/api/Paciente/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cpf, genero, telefone, endereco, dataNascimento }),
      });

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

      setSnackbar({ open: true, message: "Paciente atualizado com sucesso!", severity: "success" });
      resetForm();
      fetchPacientes();
      return;
    }

    const usuarioRes = await fetch("https://localhost:44327/api/Usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome, email, senha: "123456", tipo: "paciente" }),
    });

    if (!usuarioRes.ok) {

      const erro = await usuarioRes.text(); // <-- pegue o erro do backend
      console.error("Erro ao criar usuário:", erro); // <-- log completo


      setSnackbar({ open: true, message: "Erro ao criar usuário", severity: "error" });
      return;
    }

    const usuario = await usuarioRes.json();

    const pacienteRes = await fetch("https://localhost:44327/api/Paciente", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ usuarioId: usuario.id, nome, email, cpf, genero, telefone, endereco, dataNascimento }),
    });

    if (pacienteRes.ok) {
      setSnackbar({ open: true, message: "Paciente cadastrado com sucesso!", severity: "success" });
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
      setSnackbar({ open: true, message: "Paciente removido com sucesso!", severity: "info" });
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
    setNome(""); setEmail(""); setCpf(""); setGenero(""); setTelefone(""); setEndereco(""); setDataNascimento("");
    setEditingId(null); setUsuarioId(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nome", headerName: "Nome", width: 160 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "cpf", headerName: "CPF", width: 120 },
    { field: "genero", headerName: "Gênero", width: 100 },
    { field: "telefone", headerName: "Telefone", width: 120 },
    { field: "endereco", headerName: "Endereço", width: 180 },
    {
      field: "acoes", headerName: "Ações", width: 160, renderCell: (params) => (
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
            <IconButton onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
            <IconButton onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
          </Box>
          <Button variant="outlined" size="small" onClick={() => navigate(`/historico-edicoes/${params.row.id}`)}>
            Ver Histórico
          </Button>
        </Box>
      )
    }
  ];

  const pacientesFiltrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    p.email.toLowerCase().includes(filtro.toLowerCase())
  );


  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Pacientes</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            label="Buscar por nome/email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <Select value={genero} onChange={(e) => setGenero(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="" disabled>Selecione o gênero</MenuItem>
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Feminino">Feminino</MenuItem>
            <MenuItem value="Outro">Outro</MenuItem>
          </Select>
          <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField
            label="Data de Nascimento" type="date" value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)} fullWidth sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={handleAdd}>{editingId ? "Atualizar" : "Adicionar"}</Button>
        </Paper>

        <Paper sx={{ height: 500, width: '100%' }}>
          <TextField
            label="Buscar por nome/email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <DataGrid
            rows={pacientesFiltrados}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
          />

        </Paper>

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default PacientesPage;

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, IconButton, Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import Layout from '../components/Layout';
import DeleteIcon from '@mui/icons-material/Delete';


const SalasPage = () => {
  const [salas, setSalas] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ativa, setAtiva] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const token = localStorage.getItem('token');

  const fetchSalas = async () => {
    const res = await fetch('https://localhost:44327/api/Sala', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSalas(data);
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const handleAddOrUpdate = async () => {
    const payload = { nome, descricao, ativa };
    const url = editingId
      ? `https://localhost:44327/api/Sala/${editingId}`
      : 'https://localhost:44327/api/Sala';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    resetForm();
    fetchSalas();
  };

  const handleEdit = (sala) => {
    setNome(sala.nome);
    setDescricao(sala.descricao);
    setAtiva(sala.ativa);
    setEditingId(sala.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta sala?")) return;
  
    try {
      const res = await fetch(`https://localhost:44327/api/Sala/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        const erro = await res.text();
        console.error("Erro ao deletar sala:", erro);
        return;
      }
  
      fetchSalas();
    } catch (error) {
      console.error("Erro ao excluir sala:", error);
    }
  };
  

  const handleToggleAtiva = async (sala) => {
    const updatedSala = { ...sala, ativa: !sala.ativa };
    await fetch(`https://localhost:44327/api/Sala/${sala.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedSala),
    });
    fetchSalas();
  };

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setAtiva(true);
    setEditingId(null);
  };

  const buscaFiltrados = salas.filter(p =>
    p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    p.descricao.toLowerCase().includes(filtro.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'descricao', headerName: 'Descrição', width: 250 },
    {
      field: 'ativa',
      headerName: 'Ativa',
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={params.row.ativa}
          onChange={() => handleToggleAtiva(params.row)}
        />
      ),
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    }
    
  ];

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Gerenciamento de Salas</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            <Typography sx={{ mr: 1 }}>Ativa</Typography>
            <Switch
              checked={ativa}
              onChange={(e) => setAtiva(e.target.checked)}
            />
          </Box>
          <Button variant="contained" onClick={handleAddOrUpdate}>
            {editingId ? 'Atualizar' : 'Adicionar'}
          </Button>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <TextField
            label="Buscar por nome ou descrição"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <DataGrid
            rows={buscaFiltrados}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            autoHeight
          />
        </Paper>
      </Box>
    </Layout>
  );
};

export default SalasPage;

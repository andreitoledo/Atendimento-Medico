
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Box, Typography, Paper, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const EspecialidadesPage = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const token = localStorage.getItem('token');

  const fetchEspecialidades = async () => {
    const res = await fetch('https://localhost:44327/api/Especialidade', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setEspecialidades(data);
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const handleAdd = async () => {
    if (!titulo.trim() || !descricao.trim()) return;

    const res = await fetch('https://localhost:44327/api/Especialidade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, descricao })
    });

    if (res.ok) {
      setTitulo('');
      setDescricao('');
      fetchEspecialidades();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://localhost:44327/api/Especialidade/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      fetchEspecialidades();
    }
  };

  const handleUpdate = async () => {
    const res = await fetch(`https://localhost:44327/api/Especialidade/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ titulo: editTitulo, descricao: editDescricao })
    });

    if (res.ok) {
      setEditId(null);
      fetchEspecialidades();
    }
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Especialidades</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            label="Nova especialidade"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
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
          <Button variant="contained" onClick={handleAdd}>Adicionar</Button>
        </Paper>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Titulo / Descrição</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {especialidades.map((esp) => (
                <TableRow key={esp.id}>
                  <TableCell>{esp.id}</TableCell>
                  <TableCell>
                    {editId === esp.id ? (
                      <>
                        <TextField
                          value={editTitulo}
                          onChange={(e) => setEditTitulo(e.target.value)}
                          size="small"
                          fullWidth
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          value={editDescricao}
                          onChange={(e) => setEditDescricao(e.target.value)}
                          size="small"
                          fullWidth
                        />
                        <Button onClick={handleUpdate} size="small" sx={{ mt: 1 }}>Salvar</Button>
                      </>
                    ) : (
                      <>
                        <strong>{esp.titulo}</strong><br />
                        <small>{esp.descricao}</small>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(esp.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                      setEditId(esp.id);
                      setEditTitulo(esp.titulo);
                      setEditDescricao(esp.descricao);
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

export default EspecialidadesPage;

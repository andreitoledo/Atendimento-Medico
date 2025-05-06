import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton, Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../components/Layout';

const SalasPage = () => {
    const [salas, setSalas] = useState([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [ativa, setAtiva] = useState(true); // novo estado
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token');
  
    const fetchSalas = async () => {
      const res = await fetch('https://localhost:44327/api/Sala', { // nova rota que retorna todas
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
      setAtiva(sala.ativa); // seta status atual
      setEditingId(sala.id);
    };
  
    const handleToggleAtiva = async (sala) => {
      const updatedSala = { ...sala, ativa: !sala.ativa };
      await fetch(`https://localhost:44327/api/Sala/${sala.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
  
    return (
      <Layout>
        <Box>
          <Typography variant="h5" gutterBottom>Gerenciamento de Salas</Typography>
  
          <Paper sx={{ p: 2, mb: 3 }}>
            <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
              <Typography sx={{ mr: 1 }}>Ativa</Typography>
              <Switch checked={ativa} onChange={(e) => setAtiva(e.target.checked)} />
            </Box>
            <Button variant="contained" onClick={handleAddOrUpdate}>
              {editingId ? 'Atualizar' : 'Adicionar'}
            </Button>
          </Paper>
  
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Ativa</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salas.map((sala) => (
                  <TableRow key={sala.id}>
                    <TableCell>{sala.id}</TableCell>
                    <TableCell>{sala.nome}</TableCell>
                    <TableCell>{sala.descricao}</TableCell>
                    <TableCell>
                      <Switch
                        checked={sala.ativa}
                        onChange={() => handleToggleAtiva(sala)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(sala)}>
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
  

export default SalasPage;

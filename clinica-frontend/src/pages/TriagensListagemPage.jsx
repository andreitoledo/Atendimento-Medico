import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton
} from "@mui/material";
import Layout from "../components/Layout";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const TriagensListagemPage = () => {
  const [triagens, setTriagens] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:44327/api/Triagem", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTriagens(data));
  }, [token]);

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Triagens Registradas</Typography>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Pressão</TableCell>
                <TableCell>Frequência</TableCell>
                <TableCell>Temperatura</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {triagens.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{new Date(t.dataTriagem).toLocaleString()}</TableCell>
                  <TableCell>{t.pressaoArterial}</TableCell>
                  <TableCell>{t.frequenciaCardiaca}</TableCell>
                  <TableCell>{t.temperatura}</TableCell>
                  <TableCell>{t.prioridade}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/triagem/editar/${t.id}`)}>
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

export default TriagensListagemPage;

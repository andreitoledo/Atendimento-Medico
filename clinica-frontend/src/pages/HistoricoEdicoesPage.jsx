import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@mui/material";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";

const HistoricoEdicoesPage = () => {
  const { pacienteId } = useParams();
  const [registros, setRegistros] = useState([]);
  const [mostrarDetalhes, setMostrarDetalhes] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const res = await fetch(`https://localhost:44327/api/HistoricoEdicao/paciente/${pacienteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRegistros(data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    };

    if (pacienteId) {
      fetchHistorico();
    }
  }, [pacienteId]);

  const toggleDetalhes = (id) => {
    setMostrarDetalhes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>Histórico de Edições</Typography>
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Entidade</TableCell>
                <TableCell>Registro</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registros.map((registro) => (
                <React.Fragment key={registro.id}>
                  <TableRow>
                    <TableCell>{registro.id}</TableCell>
                    <TableCell>{registro.entidade}</TableCell>
                    <TableCell>{registro.registroId}</TableCell>
                    <TableCell>{new Date(registro.dataAlteracao).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button onClick={() => toggleDetalhes(registro.id)}>
                        {mostrarDetalhes[registro.id] ? "Ocultar" : "Ver Detalhes"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {mostrarDetalhes[registro.id] && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box display="flex" gap={4}>
                          <Box flex={1}>
                            <Typography variant="subtitle2">Antes:</Typography>
                            <pre style={{ whiteSpace: "pre-wrap" }}>
                              {JSON.stringify(JSON.parse(registro.snapshotAnterior), null, 2)}
                            </pre>
                          </Box>
                          <Box flex={1}>
                            <Typography variant="subtitle2">Depois:</Typography>
                            <pre style={{ whiteSpace: "pre-wrap" }}>
                              {JSON.stringify(JSON.parse(registro.snapshotNovo), null, 2)}
                            </pre>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Layout>
  );
};

export default HistoricoEdicoesPage;

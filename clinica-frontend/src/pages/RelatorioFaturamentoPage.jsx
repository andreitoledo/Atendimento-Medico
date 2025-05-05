import React, { useState } from "react";
import Layout from "../components/Layout";
import {
    Box, Typography, Paper, TextField, Button,
    Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";

const RelatorioFaturamentoPage = () => {
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [faturamentos, setFaturamentos] = useState([]);
    const [total, setTotal] = useState(0);
    const token = localStorage.getItem("token");

    const buscarFaturamentos = async () => {
        if (!inicio || !fim) return;

        const url = `https://localhost:44327/api/RelatorioFinanceiro/por-periodo?inicio=${inicio}&fim=${fim}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const data = await res.json();
            setFaturamentos(data.registros);
            setTotal(data.total || 0);
        }
    };


    const limpar = () => {
        setInicio("");
        setFim("");
        setFaturamentos([]);
        setTotal(0);
    };

    return (
        <Layout>
            <Box>
                <Typography variant="h5" gutterBottom>Relatório de Faturamento</Typography>

                <Paper sx={{ p: 2, mb: 3 }}>
                    <Box display="flex" gap={2} alignItems="center">
                        <TextField
                            label="Data Início"
                            type="date"
                            value={inicio}
                            onChange={(e) => setInicio(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Data Fim"
                            type="date"
                            value={fim}
                            onChange={(e) => setFim(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button variant="contained" onClick={buscarFaturamentos}>Buscar</Button>
                        <Button variant="outlined" onClick={limpar}>Limpar</Button>
                    </Box>
                </Paper>

                {faturamentos.length > 0 && (
                    <Paper sx={{ p: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Paciente</TableCell>
                                    <TableCell>Médico</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Forma Pagamento</TableCell>
                                    <TableCell align="right">Valor (R$)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {faturamentos.map((f) => (
                                    <TableRow key={f.id}>
                                        <TableCell>{new Date(f.data).toLocaleDateString()}</TableCell>
                                        <TableCell>{f.paciente?.usuario?.nome}</TableCell>
                                        <TableCell>{f.agendamento?.medico?.usuario?.nome}</TableCell>
                                        <TableCell>{f.descricao}</TableCell>
                                        <TableCell>{f.formaPagamento}</TableCell>
                                        <TableCell align="right">{f.valor.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={5} align="right"><strong>Total:</strong></TableCell>
                                    <TableCell align="right"><strong>R$ {total.toFixed(2)}</strong></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                )}
            </Box>
        </Layout>
    );
};

export default RelatorioFaturamentoPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
    Box, Typography, Paper, TextField, Button, Table, TableHead,
    TableRow, TableCell, TableBody, IconButton, MenuItem, Select
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from '@mui/x-data-grid';

// Componente ConsultasPage
const ConsultasPage = () => {
    const [consultas, setConsultas] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [agendamentoId, setAgendamentoId] = useState("");
    const [dataConsulta, setDataConsulta] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [prescricoes, setPrescricoes] = useState([{ medicamento: "", posologia: "" }]);
    const [exames, setExames] = useState([{ nome: "", observacoes: "" }]);
    const [editingId, setEditingId] = useState(null);
    const [filtro, setFiltro] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);   
    const token = localStorage.getItem("token");

    // Verifica se o token existe, caso contrário redireciona para login
    const fetchConsultas = async () => {
        const res = await fetch("https://localhost:44327/api/Consulta", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setConsultas(data);
    };

    // traz os agendamentos não atendidos
    // para o select de agendamentos
    const fetchAgendamentos = async () => {
        const res = await fetch("https://localhost:44327/api/Agendamento/nao-atendidos", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAgendamentos(data);
    };

    // Carrega as consultas e agendamentos ao montar o componente
    useEffect(() => {
        fetchConsultas();
        fetchAgendamentos();
    }, []);

    // Atualiza as consultas ao adicionar/editar/deletar
    const [isSaving, setIsSaving] = useState(false);

    const handleAdd = async () => {
        if (!agendamentoId || !dataConsulta || !diagnostico || isSaving) return;
    
        setIsSaving(true); // bloqueia
    
        const payload = {
            agendamentoId: parseInt(agendamentoId),
            dataConsulta,
            diagnostico,
            prescricoes,
            examesSolicitados: exames,
        };
    
        const method = editingId ? "PUT" : "POST";
        const url = `https://localhost:44327/api/Consulta${editingId ? "/" + editingId : ""}`;
    
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
    
            if (res.ok) {
                await fetchConsultas();  // aguarda atualização da lista
                resetForm();
            } else {
                alert("Erro ao salvar consulta.");
            }
        } catch (error) {
            console.error("Erro ao salvar consulta:", error);
            alert("Erro ao salvar.");
        } finally {
            setIsSaving(false); // libera botão
        }
    };
    
    // Atualiza o estado do formulário com os dados da consulta selecionada
    const handleEdit = async (c) => {
        setEditingId(c.id);
        setDataConsulta(c.dataConsulta?.substring(0, 16));
        setDiagnostico(c.diagnostico);
        setPrescricoes(c.prescricoes || [{ medicamento: "", posologia: "" }]);
        setExames(c.examesSolicitados || [{ nome: "", observacoes: "" }]);

        const agendamentoJaExiste = agendamentos.some(a => a.id === c.agendamentoId);

        if (!agendamentoJaExiste) {
            try {
                const res = await fetch(`https://localhost:44327/api/Agendamento/${c.agendamentoId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    const novo = {
                        ...data,
                        medico: { usuario: { nome: data.nomeMedico } },
                        paciente: { usuario: { nome: data.nomePaciente } }
                    };

                    // Atualiza e em seguida garante o setId
                    setAgendamentos(prev => {
                        const atualizados = [...prev, novo];
                        // setState em batch, já com ID após atualizar lista
                        setAgendamentoId(c.agendamentoId);
                        return atualizados;
                    });
                }
            } catch (err) {
                console.error("Erro ao buscar agendamento:", err);
            }
        } else {
            setAgendamentoId(c.agendamentoId);
        }
    };

    // Deleta uma consulta
    const handleDelete = async (id) => {
        const res = await fetch(`https://localhost:44327/api/Consulta/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) fetchConsultas();
    };

    const resetForm = () => {
        setAgendamentoId("");
        setDataConsulta("");
        setDiagnostico("");
        setPrescricoes([{ medicamento: "", posologia: "" }]);
        setExames([{ nome: "", observacoes: "" }]);
        setEditingId(null);
    };


    // Redireciona para o prontuário correspondente
    // com base no agendamentoId
    const handleProntuario = async (agendamentoId) => {
        const res = await fetch(`https://localhost:44327/api/ProntuarioClinico`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            alert("Erro ao verificar prontuário.");
            return;
        }

        const data = await res.json();
        const existente = data.find(p => p.agendamentoId === agendamentoId);

        if (existente) {
            navigate(`/prontuario-clinico/${existente.id}`);
        } else {
            // criar automaticamente
            // const criarRes = await fetch(`https://localhost:44327/api/ProntuarioClinico`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`
            //     },
            //     body: JSON.stringify({ agendamentoId })
            // });
            const criarRes = await fetch(`https://localhost:44327/api/ProntuarioClinico`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  agendamentoId,
                  queixaPrincipal: "",
                  historiaDoencaAtual: "",
                  historicoMedico: "",
                  historicoFamiliar: "",
                  historicoSocial: "",
                  historicoOcupacional: "",
                  sinaisVitais: "",
                  exameFisico: "",
                  hipotesesDiagnosticas: "",
                  solicitacaoExames: "",
                  prescricao: "",
                  planoTerapeutico: "",
                  evolucaoClinica: "",
                  consentimentos: "",
                  observacoesEncerramento: ""
                })
              });
              

            if (criarRes.ok) {
                const novo = await criarRes.json();
                navigate(`/prontuario-clinico/${novo.id}`);
            } else {
                alert("Erro ao criar prontuário.");
            }
        }
    };



    // Gerar Receita
    const gerarReceita = (consultaId) => {
        const url = `https://localhost:44327/api/Receita/${consultaId}/pdf`;
        fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                window.open(blobUrl, "_blank");
            })
            .catch(() => alert("Erro ao gerar receita"));
    };

    // Filtra as consultas com base no filtro de texto
    const consultasFiltradas = consultas.filter(c => {
        const paciente = c.agendamento?.paciente?.usuario?.nome?.toLowerCase() || "";
        const medico = c.agendamento?.medico?.usuario?.nome?.toLowerCase() || "";
        return paciente.includes(filtro.toLowerCase()) || medico.includes(filtro.toLowerCase());
    });

    // Mapeia as consultas para o DataGrid
    const consultasGrid = consultas.map(c => ({
        id: c.id,
        agendamento: `${c.agendamento?.paciente?.usuario?.nome || ""} com ${c.agendamento?.medico?.usuario?.nome || ""}`,
        dataConsulta: new Date(c.dataConsulta).toLocaleString(),
        diagnostico: c.diagnostico,
        raw: c, // usado para edição/deleção
    }));

    // com botão gerar receita
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'agendamento', headerName: 'Agendamento', width: 300, flex: 1 },
        { field: 'dataConsulta', headerName: 'Data', width: 200 },
        { field: 'diagnostico', headerName: 'Diagnóstico', width: 300, flex: 1 },
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 250,
            renderCell: (params) => (
                <Box display="flex" gap={1}>
                    <IconButton onClick={() => handleEdit(params.row.raw)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>

                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleProntuario(params.row.raw.agendamentoId)}
                    >
                        Prontuário
                    </Button>
                </Box>
            )
        }
    ];

    // Renderiza o componente
    // com o layout, formulário e tabela de consultas
    return (
        <Layout>
            <Box>
                <Typography variant="h5" gutterBottom>Consultas</Typography>

                <Paper sx={{ p: 2, mb: 3 }}>
                    <Select
                        value={agendamentoId || ""}
                        onChange={(e) => {
                            const idSelecionado = e.target.value;
                            setAgendamentoId(idSelecionado);
                            const encontrado = agendamentos.find(a => a.id === idSelecionado);
                            setAgendamentoSelecionado(encontrado);
                        }}
                        displayEmpty
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>Selecione o agendamento</MenuItem>
                        {agendamentos.map(a => (
                            <MenuItem key={a.id} value={a.id}>
                                {a.paciente?.usuario?.nome} com {a.medico?.usuario?.nome} - {new Date(a.dataConsulta).toLocaleString()}
                            </MenuItem>
                        ))}
                    </Select>



                    <TextField label="Data da Consulta" type="datetime-local" value={dataConsulta}
                        onChange={(e) => setDataConsulta(e.target.value)}
                        fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                    <TextField label="Diagnóstico" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} fullWidth sx={{ mb: 2 }} />

                    <Typography variant="subtitle1">Prescrições</Typography>
                    {prescricoes.map((p, i) => (
                        <Box key={i} display="flex" gap={2} sx={{ mb: 1 }}>
                            <TextField label="Medicamento" value={p.medicamento}
                                onChange={(e) => {
                                    const list = [...prescricoes];
                                    list[i].medicamento = e.target.value;
                                    setPrescricoes(list);
                                }} fullWidth />
                            <TextField label="Posologia" value={p.posologia}
                                onChange={(e) => {
                                    const list = [...prescricoes];
                                    list[i].posologia = e.target.value;
                                    setPrescricoes(list);
                                }} fullWidth />
                        </Box>
                    ))}
                    <Button onClick={() => setPrescricoes([...prescricoes, { medicamento: "", posologia: "" }])}>+ Prescrição</Button>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Exames Solicitados</Typography>
                    {exames.map((e, i) => (
                        <Box key={i} display="flex" gap={2} sx={{ mb: 1 }}>
                            <TextField label="Exame" value={e.nome}
                                onChange={(evt) => {
                                    const list = [...exames];
                                    list[i].nome = evt.target.value;
                                    setExames(list);
                                }} fullWidth />
                            <TextField label="Observações" value={e.observacoes}
                                onChange={(evt) => {
                                    const list = [...exames];
                                    list[i].observacoes = evt.target.value;
                                    setExames(list);
                                }} fullWidth />
                        </Box>
                    ))}
                    <Button onClick={() => setExames([...exames, { nome: "", observacoes: "" }])}>+ Exame</Button>

                    <Button variant="contained" 
                    onClick={handleAdd} 
                    sx={{ mt: 2 }}
                    disabled={isSaving}
                    >
                        {editingId ? "Atualizar Consulta" : "Salvar Consulta"}
                    </Button>
                    {editingId && <Button onClick={resetForm}>Cancelar</Button>}
                </Paper>

                <Paper>
                    <TextField
                        label="Buscar por paciente ou médico"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />

                    <DataGrid
                        rows={consultasGrid.filter(c =>
                            c.agendamento.toLowerCase().includes(filtro.toLowerCase())
                        )}
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

export default ConsultasPage;

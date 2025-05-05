import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RecepcaoPage from './pages/RecepcaoPage';
import TriagemPage from './pages/TriagemPage';
import EspecialidadesPage from './pages/EspecialidadesPage';
import MedicosPage from './pages/MedicosPage';
import PacientesPage from './pages/PacientesPage';
import UsuariosPage from './pages/UsuariosPage';
import AgendamentosPage from './pages/AgendamentosPage';
import ConsultasPage from './pages/ConsultasPage';
import FaturamentosPage from './pages/FaturamentosPage';
import RelatorioFaturamentoPage from './pages/RelatorioFaturamentoPage';
import DashboardFinanceiroPage from './pages/DashboardFinanceiroPage';
import RelatorioConsultasMedicoPage from './pages/RelatorioConsultasMedicoPage';
import RelatorioComparecimentoPage from './pages/RelatorioComparecimentoPage';
import RelatorioAgendamentosPorPeriodoPage from './pages/RelatorioAgendamentosPorPeriodoPage';
import RelatorioPacientesRecorrentesPage from './pages/RelatorioPacientesRecorrentesPage';
import RelatorioProducaoMedicaPage from './pages/RelatorioProducaoMedicaPage';
import RelatorioConsultasPorEspecialidadesPage from './pages/RelatorioConsultasPorEspecialidadesPage';
import RelatorioConsultasPorDiaPage from './pages/RelatorioConsultasPorDiaPage';



function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {token && (
          <>
            <Route path="/home" element={<HomePage />} />
            <Route path="/recepcao" element={<RecepcaoPage />} />
            <Route path="/triagem" element={<TriagemPage />} />
            <Route path="/especialidades" element={<EspecialidadesPage />} />
            <Route path="/medicos" element={<MedicosPage />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/agendamentos" element={<AgendamentosPage />} />
            <Route path="/consultas" element={<ConsultasPage />} />
            <Route path="/faturamentos" element={<FaturamentosPage />} />
            <Route path="/relatoriosFaturamentos" element={<RelatorioFaturamentoPage />} />
            <Route path="/dashboardFinanceiro" element={<DashboardFinanceiroPage />} />
            <Route path="/relatorioConsultaMedica" element={<RelatorioConsultasMedicoPage />} />
            <Route path="/relatorioComparecimento" element={<RelatorioComparecimentoPage />} />
            <Route path="/relatorioAgendamentosPorPeriodo" element={<RelatorioAgendamentosPorPeriodoPage />} />
            <Route path="/relatorioPacientesRecorrentes" element={<RelatorioPacientesRecorrentesPage />} />
            <Route path="/relatorioProducaoMedica" element={<RelatorioProducaoMedicaPage />} />
            <Route path="/relatorioConsultasPorEspecialidades" element={<RelatorioConsultasPorEspecialidadesPage />} />
            <Route path="/relatorioConsultasPorDia" element={<RelatorioConsultasPorDiaPage />} />
            
            
            


          </>
        )}
        <Route path="*" element={<Navigate to={token ? '/home' : '/'} />} />
      </Routes>
    </Router>
  );
}

export default App;
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


          </>
        )}
        <Route path="*" element={<Navigate to={token ? '/home' : '/'} />} />
      </Routes>
    </Router>
  );
}

export default App;
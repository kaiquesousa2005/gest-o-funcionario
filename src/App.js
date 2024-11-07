import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Importando a tela de cadastro
import ProtectedRoute from './pages/ProtectedRoute';
import { AuthProvider } from './pages/AuthContext';
import Component from './components/Component';
import Header from './components/header';
import ResumeLayout from './pages/Curriculo';
import HistoricoAtualizacoes from './pages/Historico';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Header className="header" />
        <Routes>

          <Route path="/" element={<Login />} />


          <Route path="/signup" element={<Signup />} />

          <Route
            path="/formulario"
            element={
              <ProtectedRoute>
                <Component className="formulario" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/curriculo"
            element={
              <ProtectedRoute>
                <ResumeLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historico"
            element={
              <ProtectedRoute>
                <HistoricoAtualizacoes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

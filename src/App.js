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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header className="header" />
        <Routes>
          {/* Rota de Login */}
          <Route path="/" element={<Login />} />

          {/* Rota de Cadastro */}
          <Route path="/signup" element={<Signup />} /> {/* Nova rota de cadastro */}

          {/* Rota principal "/" protegida */}
          <Route
            path="/formulario"
            element={
              <ProtectedRoute>
                <Component className="formulario" />
              </ProtectedRoute>
            }
          />

          {/* Nova rota para o currículo */}
          <Route
            path="/curriculo"
            element={
              <ProtectedRoute>
                <ResumeLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { saveDataToFirestore } from '../components/FirestoreStorage'; // Função para salvar dados adicionais
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    // Verifica se as senhas são iguais
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSigningUp(true);

    try {
      // Verifica se o e-mail já está em uso
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.length > 0) {
        // Se o e-mail já está em uso, exibe erro
        setError('Este e-mail já está registrado. Tente outro.');
        setIsSigningUp(false);
        return;
      }

      // Cria o usuário
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Dados adicionais para salvar no Firestore
      const userData = {
        email: user.email,
        createdAt: new Date(),
      };

      // Salva os dados do usuário no Firestore
      await saveDataToFirestore(userData);
      
      navigate('/'); // Redireciona para a página principal após o cadastro
    } catch (error) {
      console.error("Erro ao criar usuário: ", error);
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">Criar Conta</h1>
        {error && <p className="signup-error">{error}</p>}
        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Confirme a Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="signup-input"
          />
          <button type="submit" disabled={isSigningUp} className="signup-button">
            {isSigningUp ? 'Criando Conta...' : 'Cadastrar'}
          </button>
        </form>
        <p className="signup-login-link">
          Já tem uma conta? <span onClick={() => navigate('/login')}>Faça login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
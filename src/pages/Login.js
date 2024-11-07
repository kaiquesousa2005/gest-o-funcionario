import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogar, loginWithEmailAndPassword } from './Api'; // Função de login com email e senha
import './Login.css';

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setError('');

    try {
      const result = await googleLogar();
      console.log('Usuário logado com sucesso:', result.user);
      navigate('/formulario');
    } catch (error) {
      setError('Erro ao fazer login com o Google.');
      console.error('Erro ao fazer login:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await loginWithEmailAndPassword(email, password);
      navigate('/formulario');
    } catch (error) {
      console.error('Erro ao fazer login com email e senha:', error);

      if (error.code === 'auth/user-not-found') {
        setError('Usuário não encontrado. Por favor, faça o cadastro.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Senha incorreta. Tente novamente.');
      } else {
        setError('E-mail ou senha incorreta. Tente novamente.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Acessar</h1>


        {error && <p className="error-message">{error}</p>}


        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Conectando...' : 'Entrar com E-mail'}
          </button>
        </form>


        <button
          className="google-login-button"
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
        >
          <img
            src="https://img.icons8.com/?size=512&id=17949&format=png"
            alt="Google logo"
            className="google-icon"
          />
          {isLoggingIn ? 'Conectando...' : 'Entrar com o Google'}
        </button>


        <p className="register-link">
          Ainda não tem uma conta?{' '}
          <span onClick={() => navigate('/signup')} className="register-text">
            Cadastre-se
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

// src/API.js
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';

export const googleLogar = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result;
    } catch (error) {
        console.error("Erro ao fazer login: ", error);
        throw error;
    }
};

export const signUpWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential; // Retorna as credenciais do usuário
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      throw error;
    }
  };

// Função para login com email e senha
export const loginWithEmailAndPassword = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result;
    } catch (error) {
        console.error("Erro ao fazer login com email e senha: ", error);
        throw error;
    }
};

import { db, storage } from '../firebaseConfig'; 
import { auth } from '../firebaseConfig'; 
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


// Função para fazer upload do arquivo para o Firebase Storage e retornar o URL
export const uploadFileToStorage = async (file) => {
  console.log('Arquivo recebido:', file); // Para depuração
  if (!file) {
    throw new Error('Nenhum arquivo foi fornecido para upload');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const fileName = `${Date.now()}_${file.name}`; // Nome de arquivo único
    const storageRef = ref(storage, `profileImages/${user.uid}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Upload bem-sucedido:', snapshot);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    throw error;
  }
};

export const saveDataToFirestore = async (data) => {
  const userId = auth.currentUser?.uid; // Obtém o ID do usuário logado

  if (!userId) {
    throw new Error('Usuário não está autenticado');
  }

  try {
    // Salva os dados no Firestore no documento com o ID do usuário
    await setDoc(doc(db, 'users', userId), data); 
    console.log('Dados salvos com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    throw error;
  }
};

// Função para recuperar dados do Firestore para o usuário logado
export const getUserData = async () => {
  const userId = auth.currentUser?.uid; // Obtém o ID do usuário logado

  if (!userId) {
    throw new Error('Usuário não está autenticado');
  }

  try {
    // Obtém os dados do Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (userDoc.exists()) {
      return userDoc.data(); // Retorna os dados do usuário
    } else {
      throw new Error('Dados não encontrados');
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};
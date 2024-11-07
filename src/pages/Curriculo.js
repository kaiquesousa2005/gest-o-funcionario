import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, updateDoc, deleteDoc, onSnapshot, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import './Curriculo.css';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  title: { fontSize: 24, marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
});

const ResumePDF = ({ userData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{userData.name}</Text>
        <Text style={styles.text}>{userData.bio}</Text>
        <Text style={styles.text}>Data de Nascimento: {userData.birthDate}</Text>
        <Text style={styles.text}>Sexo: {userData.gender}</Text>
        <Text style={styles.subtitle}>Informações do Funcionário</Text>
        <Text style={styles.text}>Cargo: {userData.position}</Text>
        <Text style={styles.text}>Setor: {userData.sector}</Text>
        <Text style={styles.text}>Data de Admissão: {userData.admissionDate}</Text>
        <Text style={styles.text}>Salário: R$ {userData.salary}</Text>
        <Text style={styles.subtitle}>Contato</Text>
        <Text style={styles.text}>Telefone: {userData.phone}</Text>
        <Text style={styles.text}>Endereço: {userData.address}</Text>
      </View>
    </Page>
  </Document>
);

export default function ResumeLayout() {
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsersData(users);
        setLoading(false);
      },
      (err) => {
        setError('Erro ao buscar dados: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleEdit = (user, e) => {
    e.stopPropagation();
    setEditingUser(user);
    setOpenDialog(true);
  };

  const registrarAtualizacao = async (tipo, detalhes) => {
    try {
      await addDoc(collection(db, 'historicoAtualizacoes'), {
        tipo,
        detalhes,
        usuario: auth.currentUser.email,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao registrar atualização:", error);
    }
  };
  
  const handleSave = async () => {
    if (editingUser) {
      try {
        const userRef = doc(db, 'users', editingUser.id);
        const userSnapshot = await getDoc(userRef);  // Obter os dados atuais do usuário
        const oldData = userSnapshot.data();  // Dados antigos
  
        // Comparar os dados antigos com os novos
        let changeDetails = '';
        for (const key in oldData) {
          if (oldData[key] !== editingUser[key]) {
            changeDetails += `${key}: de "${oldData[key]}" para "${editingUser[key]}", `;
          }
        }
  
        await updateDoc(userRef, editingUser);  // Atualizando os dados do usuário
        await registrarAtualizacao('Atualização', changeDetails || `Currículo de ${editingUser.name} atualizado`);  // Registrando a atualização no histórico
  
        setOpenDialog(false);
        setEditingUser(null);
      } catch (err) {
        setError('Erro ao atualizar dados: ' + err.message);
      }
    }
  };
  
  const handleDelete = async (userId, userName, e) => {
    e.stopPropagation();  // Impede a propagação do evento, evitando problemas com outros handlers de click
  
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);  // Obter os dados do usuário
        const userData = userSnapshot.data();  // Dados completos do usuário
  
        await deleteDoc(userRef);  // Deletando o usuário
  
        // Registrando a exclusão no histórico
        await registrarAtualizacao('Exclusão', `Currículo de ${userName} excluído. Dados: ${JSON.stringify(userData)}`);
  
      } catch (err) {
        setError('Erro ao excluir usuário: ' + err.message);  // Tratando erro
      }
    }
  };
  

  if (loading) return <CircularProgress className="loading" />;
  if (error) return <div className="text-error">Erro: {error}</div>;
  if (usersData.length === 0) return <div>Nenhum dado encontrado</div>;

  return (

        <div className="curriculo-wrapper">
      <div className="resume-container">
        {usersData.map((user) => (
          <div key={user.id} className="resume-card">
            <div
              onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
              className="resume-header cursor-pointer"
            >
              <h2 className="resume-name">{user.name}</h2>
              <p className="resume-bio">{user.bio}</p>
              <div className="resume-additional-info">
                <p>Data de Nascimento: {user.birthDate}</p>
                <p>Sexo: {user.gender}</p>
              </div>
            </div>
            {expandedId === user.id && (
              <div className="resume-expanded-content">
                <div className="resume-section employee-info">
                  <h3 className="section-title">Informações do Funcionário</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Cargo</span>
                      <span className="info-value">{user.position}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Setor</span>
                      <span className="info-value">{user.sector}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Data de Admissão</span>
                      <span className="info-value">{user.admissionDate}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Salário</span>
                      <span className="info-value">R$ {user.salary}</span>
                    </div>
                  </div>
                </div>
                <div className="resume-section contact-info">
                  <h3 className="section-title">Contato</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Telefone</span>
                      <span className="info-value">{user.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Endereço</span>
                      <span className="info-value">{user.address}</span>
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <Button
                    variant="contained"
                    onClick={(e) => handleEdit(user, e)}
                    className="MuiButton-contained"
                  >
                    Editar
                  </Button>
                  <Button
  variant="contained"
  onClick={(e) => handleDelete(user.id, user.name, e)}  // Passando o ID, nome e evento
  className="MuiButton-contained"
  style={{ backgroundColor: '#EF4444' }}
>
  Excluir
</Button>
                  <PDFDownloadLink
                    document={<ResumePDF userData={user} />}
                    fileName={`curriculo_${user.name}.pdf`}
                    className="pdf-link"
                  >
                    {({ loading }) =>
                      loading ? 'Carregando...' : (
                        <Button variant="contained" className="pdf-button">
                          Baixar PDF
                        </Button>
                      )
                    }
                  </PDFDownloadLink>
                </div>
              </div>
            )}
            <div className="expand-icon">
              <ChevronDown
                className={`transition-transform ${expandedId === user.id ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        ))}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} className="edit-dialog">
          <DialogTitle className="dialog-title">Editar Usuário</DialogTitle>
          <DialogContent className="dialog-content">
            {editingUser && Object.keys(editingUser).map(key => {
              if (key !== 'id' && key !== 'photoUrl') {
                return (
                  <div key={key} className="form-field">
                    <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      id={key}
                      type="text"
                      value={editingUser[key]}
                      onChange={(e) => setEditingUser({ ...editingUser, [key]: e.target.value })}
                    />
                  </div>
                );
              }
              return null;
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogActions>
        </Dialog>
      <Button
  variant="text"
  onClick={() => navigate('/formulario')}
  startIcon={<ChevronLeft className="text-blue-500" />}
  className="button-anterior"
>
  Anterior
</Button>
<Button
  variant="contained"
  onClick={() => navigate('/historico')}
  className="historico-button"
>
  Ver Histórico
</Button>

      </div>
    </div>
  );
}

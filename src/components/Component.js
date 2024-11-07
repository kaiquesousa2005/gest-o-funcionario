import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { saveDataToFirestore, uploadFileToStorage } from './FirestoreStorage';
import { UserRound, HelpCircle, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Switch } from '@mui/material';
import '../components/Component.css';

export default function Component() {
  const [birthDate, setBirthDate] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isRoundPhoto, setIsRoundPhoto] = useState(false);
  const [bio, setBio] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Usuário autenticado:', user.uid);
      } else {
        console.log('Usuário não autenticado');
        // Opcionalmente, você pode redirecionar para a página de login aqui
        // navigate('/login');
      }
    });

    return () => unsubscribe();
  }, []);


  const handlePhotoUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          photo: 'A foto deve ser menor que 2MB.',
        }));
        setPhotoUrl(null);
        setFile(null);
      } else {
        setFormErrors((prev) => ({ ...prev, photo: null }));
        const url = URL.createObjectURL(selectedFile);
        setPhotoUrl(url);
        setFile(selectedFile);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!birthDate) errors.birthDate = 'Data de nascimento é obrigatória.';
    if (!admissionDate) errors.admissionDate = 'Data de admissão é obrigatória.';
    if (!photoUrl) errors.photo = 'A foto do perfil é obrigatória.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      try {
        if (!auth.currentUser) {
          throw new Error('Usuário não está autenticado');
        }
  
        if (!file) {
          throw new Error('Nenhum arquivo foi selecionado');
        }
  
        const photoUrl = await uploadFileToStorage(file);

        await saveDataToFirestore({
          bio,
          name: document.getElementById('name').value,
          address: document.getElementById('address').value,
          phone: document.getElementById('phone').value,
          gender: document.getElementById('gender').value,
          birthDate,
          admissionDate,
          position: document.getElementById('position').value,
          sector: document.getElementById('sector').value,
          salary: document.getElementById('salary').value,
          photoUrl,
        });

        console.log('Dados salvos com sucesso!');
      } catch (error) {
        console.error("Erro ao salvar dados: ", error);
        setFormErrors((prev) => ({ ...prev, submit: error.message }));
      }
    }
  };


  return (
    <div className="formulario">
      <div className="description">
        <h1>Fale-nos um pouco sobre você</h1>
        <div className="input-group">
          <div className="label-wrapper">
            <input
              id="bio"
              placeholder=" "
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
            />
            <label htmlFor="bio">Diga quem você é</label>
          </div>
          <p className="placeholder-text">Como os empregadores podem entrar em contato com você e qual a sua profissão.</p>
        </div>
      </div>

      <div className="section-title">
        <h1>Informação de contato</h1>
      </div>

      <div className="form-card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <div className="input-group">
                <div className="label-wrapper">
                  <input id="name" placeholder=" " required />
                  <label htmlFor="name">Nome Completo</label>
                </div>
                <p className="placeholder-text">ex. Kaique</p>
              </div>

              <div className="input-group">
                <div className="label-wrapper">
                  <input id="address" placeholder=" " required />
                  <label htmlFor="address">Endereço</label>
                </div>
                <p className="placeholder-text">ex. Rua, N° da Casa - Bairro</p>
              </div>
            </div>

            <div className="photo-section">
              <div className={`photo-preview ${isRoundPhoto ? 'round' : 'square'}`}>
                {photoUrl ? (
                  <img src={photoUrl} alt="Perfil" />
                ) : (
                  <UserRound className="default-icon" />
                )}
              </div>
              <div className="info-photo">
                <div className="photo-header">
                  <h3>Foto do Perfil</h3>
                  <HelpCircle className="help-icon" size={20} />
                </div>
                <label className="upload-button">
                  <div className="upload-icon-container">
                  <ArrowUp color="#ffffff" className="upload-icon" />
                  </div>
                  Adicionar Foto
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                </label>
                <div className="photo-options">
                  <span>Foto Redonda</span>
                  <Switch
                    checked={isRoundPhoto}
                    onChange={(e) => setIsRoundPhoto(e.target.checked)}
                    color="primary"
                  />
                </div>
              </div>
              {formErrors.photo && <p className="error-text">{formErrors.photo}</p>}
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="input-group">
                <div className="label-wrapper">
                  <input id="phone" placeholder=" " required />
                  <label htmlFor="phone">Telefone</label>
                </div>
                <p className="placeholder-text">ex. (85) 9 8581-8139</p>
              </div>
            </div>

            <div className="col-sexo">
              <label htmlFor="gender">Gênero</label>
              <select id="gender" required>
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="col">
            <div className="input-group">
              <div className="label-wrapper">
                <input
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)} 
                  className="date-input"
                  required
                />
                <label htmlFor="birthDate">Data de Nascimento</label>
              </div>
              {formErrors.birthDate && <p className="error-text">{formErrors.birthDate}</p>}
            </div>
          </div>

          <div className="funcionario">
            <h1>Informações do Funcionário</h1>
          </div>

          <div className="row">
            <div className="col">
              <div className="input-group">
                <div className="label-wrapper">
                  <input id="position" placeholder=" " required />
                  <label htmlFor="position">Cargo</label>
                </div>
                <p className="placeholder-text">ex. Gerente</p>
              </div>
            </div>

            <div className="col">
              <div className="input-group">
                <div className="label-wrapper">
                  <input id="sector" placeholder=" " required />
                  <label htmlFor="sector">Setor</label>
                </div>
                <p className="placeholder-text">ex. Vendas</p>
              </div>
            </div>

            <div className="col">
              <div className="input-group">
                <div className="label-wrapper">
                  <input id="salary" placeholder=" " required />
                  <label htmlFor="salary">Salário</label>
                </div>
                <p className="placeholder-text">ex. 3000,00</p>
              </div>
            </div>
          </div>

          <div className="admissao">
            <div className="input-group">
              <div className="label-wrapper">
                <input
                  type="date" 
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)} 
                  className="date-input"
                  required
                />
                <label htmlFor="admissionDate">Data de Admissão</label>
              </div>
              {formErrors.admissionDate && <p className="error-text">{formErrors.admissionDate}</p>}
            </div>
          </div>

          <div className="action">
            <button type="submit" className="cadastro-btn">Cadastrar Funcionário</button> 
            <Button
              variant="contained"
              onClick={() => navigate('/curriculo')}
              className="proxima-pagina"
            >
              Proximo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

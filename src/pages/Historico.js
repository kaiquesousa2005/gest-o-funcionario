import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Historico.css';

export default function HistoricoAtualizacoes() {
  const [historico, setHistorico] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'historicoAtualizacoes'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const historicoData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Dados do histórico:', historicoData); // Para debugar os dados
      setHistorico(historicoData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="historico-container">
      <h1 className="historico-title">Histórico de Atualizações</h1>
      <div className="historico-list">
        {historico.length === 0 ? (
          <p>Não há atualizações registradas.</p>
        ) : (
          historico.map((item) => (
            <div key={item.id} className="historico-item">
              <div className="historico-item-header">
                <span className="historico-item-type">{item.tipo}</span>
                <span className="historico-item-date">
                  {new Date(item.timestamp.toDate()).toLocaleString()}
                </span>
              </div>
              <div className="historico-item-content">
                <p><strong>Usuário:</strong> {item.usuario}</p>
                <p><strong>Detalhes:</strong> {item.detalhes}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <button
        className="voltar-button"
        onClick={() => navigate('/curriculo')}
      >
        <ChevronLeft size={20} />
        Voltar para Currículos
      </button>
    </div>
  );
}

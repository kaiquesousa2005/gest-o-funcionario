import React from 'react';
import { Home } from 'lucide-react';
import './header.css';

export default function HeaderComponent() {
  return (
    <header className="header">
  <div className="container">
    <div className="flex-container">
      <div className="logo-container">
        <a href="/" className="flex-shrink-0">
          <img
            src="https://www.taugor.com.br/wp-content/uploads/2018/11/marca-taugor.png"
            alt="Taugor Logo"
            className="logo"
          />
        </a>
        </div>
          <a 
            href="/" 
            className="home-button"
          >
            <Home className="home-icon" />
          </a>
        </div>
      </div>
    </header>
  );
}

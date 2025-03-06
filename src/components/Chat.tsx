import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:3000');

interface Message {
  text: string;
  isSent: boolean;
}

type TabType = 'conversas' | 'espera' | 'contatos';

const ProfileIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('conversas');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on('message', (message: string) => {
      setMessages(prev => [...prev, { text: message, isSent: false }]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      socket.emit('message', inputMessage);
      setMessages(prev => [...prev, { text: inputMessage, isSent: true }]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleContactClick = (contact: string) => {
    setSelectedContact(contact);
    setMessages([]); // Limpa as mensagens ao trocar de contato
  };

  const handleBackClick = () => {
    setSelectedContact(null);
    setMessages([]);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'conversas':
        return (
          <ul className="contacts-list">
            <li 
              className={selectedContact === 'Maria' ? 'active' : ''} 
              onClick={() => handleContactClick('Maria')}
            >
              Maria
            </li>
            <li 
              className={selectedContact === 'José' ? 'active' : ''} 
              onClick={() => handleContactClick('José')}
            >
              José
            </li>
            <li 
              className={selectedContact === 'João' ? 'active' : ''} 
              onClick={() => handleContactClick('João')}
            >
              João
            </li>
            <li 
              className={selectedContact === 'Paula' ? 'active' : ''} 
              onClick={() => handleContactClick('Paula')}
            >
              Paula
            </li>
          </ul>
        );
      case 'espera':
        return (
          <ul className="contacts-list">
            <li>Ana (aguardando)</li>
            <li>Pedro (aguardando)</li>
          </ul>
        );
      case 'contatos':
        return (
          <ul className="contacts-list">
            <li>Carlos</li>
            <li>Beatriz</li>
            <li>Daniel</li>
            <li>Elena</li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <span>SigerChat</span>
          <div className="profile-container" ref={profileMenuRef}>
            <button className="profile-button" onClick={toggleProfileMenu}>
              <ProfileIcon />
            </button>
            {showProfileMenu && (
              <div className="profile-menu">
                <button onClick={() => console.log('Perfil')}>Meu Perfil</button>
                <button onClick={() => console.log('Configurações')}>Configurações</button>
                <button onClick={() => console.log('Sair')} className="logout">Sair</button>
              </div>
            )}
          </div>
        </div>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'conversas' ? 'active' : ''}`}
            onClick={() => setActiveTab('conversas')}
          >
            Conversas
          </button>
          <button 
            className={`nav-tab ${activeTab === 'espera' ? 'active' : ''}`}
            onClick={() => setActiveTab('espera')}
          >
            Espera
          </button>
          <button 
            className={`nav-tab ${activeTab === 'contatos' ? 'active' : ''}`}
            onClick={() => setActiveTab('contatos')}
          >
            Contatos
          </button>
        </div>
        {renderTabContent()}
      </div>
      <div className="main-chat">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <button className="back-button" onClick={handleBackClick}>
                ←
              </button>
              <h2>{selectedContact}</h2>
            </div>
            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.isSent ? 'sent' : 'received'}`}
                >
                  {message.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
              />
              <button onClick={handleSendMessage}>Enviar</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <img 
              src="/logo.png" 
              alt="SigerChat Logo" 
              className="welcome-logo"
            />
            <h2>Bem-vindo ao SigerChat</h2>
            <p>Selecione uma conversa para começar a mensagem</p>
          </div>
        )}
      </div>
    </div>
  );
}; 
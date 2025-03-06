import { useState, useEffect } from 'react';
import { authService } from '../services/api';
import type { User, Message } from '../types';

const Chat = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usuário logado (mock, depois substituir por contexto de autenticação)
  const currentUser: User = {
    id: 1,
    name: 'Usuário Atual',
    email: 'usuario@teste.com'
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await authService.getUsers();
        setUsers(data.filter((user: User) => user.email !== currentUser.email));
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar usuários');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedUser) return;
    
    // Aqui seria uma chamada para o backend para enviar a mensagem
    // Por enquanto apenas simulamos
    const newMsg: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: currentUser,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    // Carregar histórico de mensagens com este usuário
    // Por enquanto vamos apenas limpar as mensagens anteriores
    setMessages([]);
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="user-profile">
          <h3>{currentUser.name}</h3>
          <p>{currentUser.email}</p>
        </div>
        <div className="users-list">
          <h3>Contatos</h3>
          {users.length === 0 ? (
            <p>Nenhum usuário encontrado</p>
          ) : (
            users.map((user) => (
              <div 
                key={user.id || user.email} 
                className={`user-item ${selectedUser?.email === user.email ? 'selected' : ''}`}
                onClick={() => selectUser(user)}
              >
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="chat-main">
        {!selectedUser ? (
          <div className="empty-chat">
            <p>Selecione um usuário para iniciar uma conversa</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h3>{selectedUser.name}</h3>
            </div>
            <div className="chat-messages">
              {messages.length === 0 ? (
                <p className="no-messages">Nenhuma mensagem ainda. Seja o primeiro a dizer olá!</p>
              ) : (
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message ${message.sender.email === currentUser.email ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="chat-input">
              <form onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                />
                <button type="submit">Enviar</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat; 
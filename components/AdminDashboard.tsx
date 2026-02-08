import React, { useState } from 'react';
import { User, ChecklistItem, ChecklistResponse } from '../types';

interface AdminDashboardProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  items: ChecklistItem[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  responses: ChecklistResponse[];
  logo: string;
  setLogo: React.Dispatch<React.SetStateAction<string>>;
}

type AdminTab = 'overview' | 'users' | 'items' | 'responses' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  setUsers,
  items,
  setItems,
  responses,
  logo,
  setLogo,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // New item form state
  const [newItemQuestion, setNewItemQuestion] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemAssigned, setNewItemAssigned] = useState<string[]>([]);

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Visão Geral', icon: 'fas fa-chart-pie' },
    { id: 'users', label: 'Usuários', icon: 'fas fa-users' },
    { id: 'items', label: 'Itens', icon: 'fas fa-list-check' },
    { id: 'responses', label: 'Respostas', icon: 'fas fa-clipboard-list' },
    { id: 'settings', label: 'Config', icon: 'fas fa-cog' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayResponses = responses.filter(r => r.date === todayStr);

  const addUser = () => {
    if (!newUserName.trim() || !newUserRole.trim()) return;
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: newUserName.trim(),
      role: newUserRole.trim(),
      phone: newUserPhone.trim(),
      email: newUserEmail.trim(),
    };
    setUsers(prev => [...prev, newUser]);
    setNewUserName('');
    setNewUserRole('');
    setNewUserPhone('');
    setNewUserEmail('');
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addItem = () => {
    if (!newItemQuestion.trim() || !newItemCategory.trim()) return;
    const newItem: ChecklistItem = {
      id: `item_${Date.now()}`,
      question: newItemQuestion.trim(),
      category: newItemCategory.trim(),
      assignedUserIds: newItemAssigned,
    };
    setItems(prev => [...prev, newItem]);
    setNewItemQuestion('');
    setNewItemCategory('');
    setNewItemAssigned([]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleAssignedUser = (userId: string) => {
    setNewItemAssigned(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-60 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex lg:flex-col overflow-x-auto">
        <nav className="flex lg:flex-col p-2 lg:p-4 gap-1 w-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <i className={tab.icon}></i>
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Visão Geral</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Usuários</p>
                <p className="text-3xl font-black text-indigo-600">{users.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Itens</p>
                <p className="text-3xl font-black text-indigo-600">{items.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Respostas Hoje</p>
                <p className="text-3xl font-black text-green-600">{todayResponses.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Respostas</p>
                <p className="text-3xl font-black text-slate-800">{responses.length}</p>
              </div>
            </div>

            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Atividade Recente</h3>
            {responses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <i className="fas fa-inbox text-3xl text-slate-300 mb-3"></i>
                <p className="text-slate-500 font-medium">Nenhuma resposta registrada ainda.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...responses].reverse().slice(0, 10).map(resp => {
                  const respUser = users.find(u => u.id === resp.userId);
                  const answeredYes = Object.values(resp.answers).filter(Boolean).length;
                  const total = Object.keys(resp.answers).length;
                  return (
                    <div key={resp.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{respUser?.name || 'Desconhecido'}</p>
                        <p className="text-xs text-slate-400">{new Date(resp.timestamp).toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-green-600">{answeredYes}/{total}</span>
                        <p className="text-xs text-slate-400">concluídos</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Gerenciar Usuários</h2>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Novo Usuário</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Cargo / Função"
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Telefone (WhatsApp)"
                  value={newUserPhone}
                  onChange={e => setNewUserPhone(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={addUser}
                className="bg-indigo-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>Adicionar Usuário
              </button>
            </div>

            <div className="space-y-2">
              {users.map(user => (
                <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.role} &bull; {user.phone} &bull; {user.email}</p>
                  </div>
                  <button
                    onClick={() => removeUser(user.id)}
                    className="text-red-400 hover:text-red-600 transition-colors text-sm"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        {activeTab === 'items' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Gerenciar Itens do Checklist</h2>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Novo Item</h3>
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Pergunta do checklist"
                  value={newItemQuestion}
                  onChange={e => setNewItemQuestion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Categoria (ex: Segurança, Organização)"
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Atribuir a:</p>
                  <div className="flex flex-wrap gap-2">
                    {users.map(user => (
                      <button
                        key={user.id}
                        onClick={() => toggleAssignedUser(user.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          newItemAssigned.includes(user.id)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {user.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={addItem}
                className="bg-indigo-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>Adicionar Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm">{item.question}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                        {item.category}
                      </span>
                      {item.assignedUserIds.map(uid => {
                        const u = users.find(x => x.id === uid);
                        return u ? (
                          <span key={uid} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {u.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors text-sm flex-shrink-0"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responses */}
        {activeTab === 'responses' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Respostas</h2>
            {responses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <i className="fas fa-inbox text-3xl text-slate-300 mb-3"></i>
                <p className="text-slate-500 font-medium">Nenhuma resposta registrada ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...responses].reverse().map(resp => {
                  const respUser = users.find(u => u.id === resp.userId);
                  const answeredYes = Object.values(resp.answers).filter(Boolean).length;
                  const total = Object.keys(resp.answers).length;
                  return (
                    <div key={resp.id} className="bg-white p-5 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-slate-800">{respUser?.name || 'Desconhecido'}</p>
                          <p className="text-xs text-slate-400">{new Date(resp.timestamp).toLocaleString('pt-BR')}</p>
                        </div>
                        <div className="bg-green-50 text-green-700 font-bold text-sm px-3 py-1 rounded-lg">
                          {answeredYes}/{total}
                        </div>
                      </div>
                      {resp.notes && (
                        <div className="bg-slate-50 text-slate-600 text-sm p-3 rounded-xl mt-2">
                          <i className="fas fa-sticky-note mr-2 text-slate-400"></i>{resp.notes}
                        </div>
                      )}
                      <div className="mt-3 space-y-1">
                        {Object.entries(resp.answers).map(([itemId, val]) => {
                          const item = items.find(i => i.id === itemId);
                          return (
                            <div key={itemId} className="flex items-center gap-2 text-xs">
                              <i className={`fas ${val ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-400'}`}></i>
                              <span className="text-slate-600">{item?.question || itemId}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Configurações</h2>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-lg">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Logo da Empresa</h3>
              {logo && (
                <div className="mb-4">
                  <img src={logo} alt="Logo atual" className="h-20 object-contain rounded-xl border border-slate-200 p-2" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all"
              />
              {logo && (
                <button
                  onClick={() => setLogo('')}
                  className="mt-3 text-sm text-red-500 hover:text-red-700 font-bold transition-colors block"
                >
                  <i className="fas fa-trash mr-1"></i>Remover Logo
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useMemo } from 'react';
import { User, ChecklistItem, ChecklistResponse } from '../types';

interface AdminDashboardProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  items: ChecklistItem[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  responses: ChecklistResponse[];
  logo: string;
  setLogo: React.Dispatch<React.SetStateAction<string>>;
  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  adminPassword: string;
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>;
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
  companyName,
  setCompanyName,
  adminPassword,
  setAdminPassword,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // User form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Item form state
  const [newItemQuestion, setNewItemQuestion] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemRequired, setNewItemRequired] = useState(true);
  const [newItemAssigned, setNewItemAssigned] = useState<string[]>([]);

  // Settings form state
  const [settingsName, setSettingsName] = useState(companyName);
  const [settingsPassword, setSettingsPassword] = useState(adminPassword);
  const [settingsLogo, setSettingsLogo] = useState(logo);

  const stats = useMemo(() => {
    const total = responses.length;
    const conforms = responses.reduce((acc, r) => acc + Object.values(r.answers).filter(v => v).length, 0);
    const totalPossible = responses.reduce((acc, r) => acc + Object.keys(r.answers).length, 0);
    const nonConforms = totalPossible - conforms;
    const rate = totalPossible > 0 ? (conforms / totalPossible) * 100 : 0;
    const today = new Date().toLocaleDateString();
    const todayResponses = responses.filter(r => new Date(r.timestamp).toLocaleDateString() === today);
    return { total, rate, nonConforms, todayCount: todayResponses.length };
  }, [responses]);

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
      assignedUserIds: newItemAssigned.length > 0 ? newItemAssigned : users.map(u => u.id),
      required: newItemRequired,
    };
    setItems(prev => [...prev, newItem]);
    setNewItemQuestion('');
    setNewItemCategory('');
    setNewItemRequired(true);
    setNewItemAssigned([]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const saveSettings = () => {
    setCompanyName(settingsName);
    setAdminPassword(settingsPassword);
    setLogo(settingsLogo);
    alert('Configurações salvas com sucesso!');
  };

  const toggleAssignedUser = (userId: string) => {
    setNewItemAssigned(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const tabs: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Visão Geral', icon: 'fas fa-chart-pie' },
    { key: 'users', label: 'Usuários', icon: 'fas fa-users' },
    { key: 'items', label: 'Itens', icon: 'fas fa-list-check' },
    { key: 'responses', label: 'Respostas', icon: 'fas fa-clipboard-list' },
    { key: 'settings', label: 'Config', icon: 'fas fa-gear' },
  ];

  return (
    <div className="flex-1 animate-fadeIn">
      {/* Tab navigation */}
      <div className="bg-white border-b border-blue-100 px-6 overflow-x-auto">
        <div className="flex space-x-1 max-w-6xl mx-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.key
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto w-full">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Painel Administrativo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-[2rem] border border-blue-100 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600">
                    <i className="fas fa-clipboard-list text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Respostas</p>
                    <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-blue-100 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600">
                    <i className="fas fa-percentage text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Conformidade</p>
                    <p className="text-2xl font-black text-indigo-600">{stats.rate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-rose-100 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center text-rose-600">
                    <i className="fas fa-triangle-exclamation text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Falhas</p>
                    <p className="text-2xl font-black text-rose-600">{stats.nonConforms}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-blue-100 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600">
                    <i className="fas fa-calendar-day text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hoje</p>
                    <p className="text-2xl font-black text-slate-800">{stats.todayCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Responses */}
            <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-tight">Respostas Recentes</h3>
            {responses.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-blue-100 p-10 text-center">
                <i className="fas fa-inbox text-slate-300 text-4xl mb-4"></i>
                <p className="text-slate-400 font-medium">Nenhuma resposta registrada ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {responses.slice(-5).reverse().map(resp => {
                  const respUser = users.find(u => u.id === resp.userId);
                  const totalAnswers = Object.keys(resp.answers).length;
                  const conformCount = Object.values(resp.answers).filter(Boolean).length;
                  return (
                    <div key={resp.id} className="bg-white rounded-2xl border border-blue-100 p-5 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-50 p-3 rounded-xl">
                          <i className="fas fa-user text-indigo-600"></i>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{respUser?.name || 'Desconhecido'}</p>
                          <p className="text-xs text-slate-400">{new Date(resp.timestamp).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-indigo-600">{conformCount}/{totalAnswers}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conformes</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Gerenciar Usuários</h2>

            {/* Add User Form */}
            <div className="bg-white rounded-[2rem] border border-blue-100 shadow-sm p-6 mb-8">
              <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest mb-4">Novo Usuário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="Nome completo"
                  className="bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  placeholder="Função / Cargo"
                  className="bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={e => setNewUserPhone(e.target.value)}
                  placeholder="Telefone (WhatsApp)"
                  className="bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="E-mail"
                  className="bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={addUser}
                disabled={!newUserName.trim() || !newUserRole.trim()}
                className="bg-indigo-600 text-white font-black py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
              >
                <i className="fas fa-plus mr-2"></i> Adicionar Usuário
              </button>
            </div>

            {/* User List */}
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="bg-white rounded-2xl border border-blue-100 p-5 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-50 p-3 rounded-xl">
                      <i className="fas fa-user-tie text-indigo-600"></i>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">{user.role}</p>
                      <div className="flex space-x-3 mt-1">
                        <span className="text-[10px] text-slate-400"><i className="fab fa-whatsapp mr-1"></i>{user.phone}</span>
                        <span className="text-[10px] text-slate-400"><i className="fas fa-envelope mr-1"></i>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeUser(user.id)}
                    className="text-rose-400 hover:text-rose-600 transition-colors p-2"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
              {users.length === 0 && (
                <div className="bg-white rounded-[2rem] border border-blue-100 p-10 text-center">
                  <i className="fas fa-users text-slate-300 text-4xl mb-4"></i>
                  <p className="text-slate-400 font-medium">Nenhum usuário cadastrado.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Gerenciar Itens do Checklist</h2>

            {/* Add Item Form */}
            <div className="bg-white rounded-[2rem] border border-blue-100 shadow-sm p-6 mb-8">
              <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest mb-4">Novo Item</h3>
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  value={newItemQuestion}
                  onChange={e => setNewItemQuestion(e.target.value)}
                  placeholder="Pergunta do checklist"
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value)}
                  placeholder="Categoria (ex: Segurança, Organização)"
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center space-x-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItemRequired}
                      onChange={e => setNewItemRequired(e.target.checked)}
                      className="mr-2 accent-indigo-600"
                    />
                    <span className="text-sm font-semibold text-slate-600">Obrigatório</span>
                  </label>
                </div>
                {users.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Atribuir a:</p>
                    <div className="flex flex-wrap gap-2">
                      {users.map(user => (
                        <button
                          key={user.id}
                          onClick={() => toggleAssignedUser(user.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            newItemAssigned.includes(user.id)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-blue-50 text-slate-600 hover:bg-blue-100'
                          }`}
                        >
                          {user.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={addItem}
                disabled={!newItemQuestion.trim() || !newItemCategory.trim()}
                className="bg-indigo-600 text-white font-black py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
              >
                <i className="fas fa-plus mr-2"></i> Adicionar Item
              </button>
            </div>

            {/* Item List */}
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-blue-100 p-5 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm mb-1">{item.question}</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-widest">{item.category}</span>
                      {item.required && <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Obrigatório</span>}
                      <span className="text-[10px] text-slate-400">
                        {item.assignedUserIds.length} usuário(s)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-rose-400 hover:text-rose-600 transition-colors p-2 ml-4"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="bg-white rounded-[2rem] border border-blue-100 p-10 text-center">
                  <i className="fas fa-list-check text-slate-300 text-4xl mb-4"></i>
                  <p className="text-slate-400 font-medium">Nenhum item cadastrado.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Responses Tab */}
        {activeTab === 'responses' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Histórico de Respostas</h2>
            {responses.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-blue-100 p-10 text-center">
                <i className="fas fa-clipboard-list text-slate-300 text-4xl mb-4"></i>
                <p className="text-slate-400 font-medium">Nenhuma resposta registrada.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...responses].reverse().map(resp => {
                  const respUser = users.find(u => u.id === resp.userId);
                  const totalAnswers = Object.keys(resp.answers).length;
                  const conformCount = Object.values(resp.answers).filter(Boolean).length;
                  const nonConformCount = totalAnswers - conformCount;
                  return (
                    <div key={resp.id} className="bg-white rounded-[2rem] border border-blue-100 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-indigo-50 p-3 rounded-xl">
                            <i className="fas fa-user text-indigo-600"></i>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{respUser?.name || 'Desconhecido'}</p>
                            <p className="text-xs text-slate-400">{new Date(resp.timestamp).toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="flex space-x-4 text-center">
                          <div>
                            <p className="font-black text-indigo-600 text-lg">{conformCount}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Conforme</p>
                          </div>
                          <div>
                            <p className="font-black text-rose-600 text-lg">{nonConformCount}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Falhas</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(resp.answers).map(([itemId, value]) => {
                          const item = items.find(i => i.id === itemId);
                          return (
                            <div key={itemId} className={`flex items-center space-x-3 p-3 rounded-xl ${value ? 'bg-indigo-50/50' : 'bg-rose-50/50'}`}>
                              <i className={`fas ${value ? 'fa-check-circle text-indigo-600' : 'fa-times-circle text-rose-500'}`}></i>
                              <span className="text-sm text-slate-700">{item?.question || itemId}</span>
                            </div>
                          );
                        })}
                      </div>
                      {resp.notes && (
                        <div className="mt-4 bg-blue-50/50 p-4 rounded-xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Observações</p>
                          <p className="text-sm text-slate-600">{resp.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Configurações</h2>
            <div className="bg-white rounded-[2rem] border border-blue-100 shadow-sm p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  value={settingsName}
                  onChange={e => setSettingsName(e.target.value)}
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  URL do Logo
                </label>
                <input
                  type="text"
                  value={settingsLogo}
                  onChange={e => setSettingsLogo(e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Senha Administrativa
                </label>
                <input
                  type="password"
                  value={settingsPassword}
                  onChange={e => setSettingsPassword(e.target.value)}
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={saveSettings}
                className="bg-indigo-600 text-white font-black py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs shadow-lg"
              >
                <i className="fas fa-save mr-2"></i> Salvar Configurações
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

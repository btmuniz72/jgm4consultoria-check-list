
import React, { useState, useEffect } from 'react';
import { AppView, User, ChecklistItem, ChecklistResponse } from './types';
import { INITIAL_USERS, INITIAL_CHECKLIST_ITEMS, ADMIN_CREDENTIALS } from './constants';
import AdminDashboard from './components/AdminDashboard';
import UserChecklist from './components/UserChecklist';
import Login from './components/Login';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('jgm4_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('jgm4_items');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST_ITEMS;
  });

  const [responses, setResponses] = useState<ChecklistResponse[]>(() => {
    const saved = localStorage.getItem('jgm4_responses');
    return saved ? JSON.parse(saved) : [];
  });

  const [companyLogo, setCompanyLogo] = useState<string>(() => {
    return localStorage.getItem('jgm4_logo') || '';
  });

  const [view, setView] = useState<AppView>(AppView.USER_SELECT);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastSubmission, setLastSubmission] = useState<ChecklistResponse | null>(null);

  useEffect(() => {
    localStorage.setItem('jgm4_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('jgm4_items', JSON.stringify(checklistItems));
  }, [checklistItems]);

  useEffect(() => {
    localStorage.setItem('jgm4_responses', JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    localStorage.setItem('jgm4_logo', companyLogo);
  }, [companyLogo]);

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    setView(AppView.CHECKLIST_FILL);
  };

  const handleChecklistSubmit = (response: ChecklistResponse) => {
    setResponses(prev => [...prev, response]);
    setLastSubmission(response);
    setView(AppView.SUCCESS);
  };

  const logout = () => {
    setCurrentUser(null);
    setView(AppView.USER_SELECT);
  };

  const userSpecificItems = currentUser 
    ? checklistItems.filter(item => item.assignedUserIds?.includes(currentUser.id))
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          {companyLogo ? (
            <img src={companyLogo} alt="Logo" className="h-10 w-auto object-contain max-w-[120px]" />
          ) : (
            <div className="bg-indigo-600 p-2 rounded-lg">
               <i className="fas fa-clipboard-check text-white"></i>
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-indigo-900 tracking-tight">JGM4 <span className="text-slate-500 font-normal">Checklist</span></h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {view === AppView.ADMIN_DASHBOARD && (
            <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              <i className="fas fa-sign-out-alt mr-2"></i>Sair
            </button>
          )}
          {view === AppView.USER_SELECT && (
            <button 
              onClick={() => setView(AppView.LOGIN)} 
              className="text-sm font-medium bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
            >
              <i className="fas fa-lock mr-2"></i>Admin
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {view === AppView.LOGIN && (
          <Login logo={companyLogo} onBack={() => setView(AppView.USER_SELECT)} onSuccess={() => setView(AppView.ADMIN_DASHBOARD)} />
        )}

        {view === AppView.USER_SELECT && (
          <div className="p-6 max-w-4xl mx-auto w-full">
            <div className="mb-10 text-center">
               {companyLogo && <img src={companyLogo} alt="Empresa" className="h-20 mx-auto mb-4 object-contain" />}
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bem-vindo ao JGM4 Checklist</h2>
               <p className="text-slate-500 text-sm">Selecione seu nome para iniciar as verificações de hoje.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all text-left flex items-start space-x-4 group relative overflow-hidden"
                >
                  <div className="bg-indigo-50 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <i className="fas fa-user text-xl"></i>
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-black text-slate-800 group-hover:text-indigo-900 transition-colors">{user.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                    <div className="mt-3 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg inline-block">
                      <i className="fab fa-whatsapp mr-1 text-green-500"></i> {user.phone}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === AppView.CHECKLIST_FILL && currentUser && (
          <UserChecklist 
            user={currentUser} 
            items={userSpecificItems} 
            onSubmit={handleChecklistSubmit}
            onCancel={() => setView(AppView.USER_SELECT)}
          />
        )}

        {view === AppView.SUCCESS && lastSubmission && currentUser && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-28 h-28 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center text-5xl mb-8 shadow-2xl shadow-green-100 animate-bounce">
              <i className="fas fa-check"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-3 tracking-tighter">Tarefa Concluída!</h2>
            <p className="text-slate-500 max-w-sm mb-10 font-medium">
              Excelente trabalho, {currentUser.name.split(' ')[0]}!
            </p>
            
            <div className="space-y-4 w-full max-w-xs">
              <a
                href={`https://wa.me/${currentUser.phone}?text=Olá! Acabei de completar o meu checklist diário na plataforma JGM4 Checklist Master.`}
                target="_blank"
                className="w-full flex items-center justify-center bg-[#25D366] text-white font-black py-5 px-6 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-green-100"
              >
                <i className="fab fa-whatsapp mr-3 text-2xl"></i> Notificar Supervisor
              </a>
              <button onClick={() => setView(AppView.USER_SELECT)} className="w-full text-slate-400 font-black py-4 uppercase tracking-widest text-xs">
                Voltar ao Início
              </button>
            </div>
          </div>
        )}

        {view === AppView.ADMIN_DASHBOARD && (
          <AdminDashboard 
            users={users} 
            setUsers={setUsers}
            items={checklistItems}
            setItems={setChecklistItems}
            responses={responses}
            logo={companyLogo}
            setLogo={setCompanyLogo}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 p-6 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Tecnologia JGM4 Consultoria</p>
        <p className="text-xs text-slate-400 font-medium">&copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;

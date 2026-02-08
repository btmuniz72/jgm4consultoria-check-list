
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, User, ChecklistItem, ChecklistResponse } from './types';
import { INITIAL_USERS, INITIAL_CHECKLIST_ITEMS, ADMIN_CREDENTIALS } from './constants';
import AdminDashboard from '@/components/AdminDashboard';
import UserChecklist from '@/components/UserChecklist';
import Login from '@/components/Login';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('jgm4_users');
    const initialized = localStorage.getItem('jgm4_initialized');
    if (saved) return JSON.parse(saved);
    return initialized ? [] : INITIAL_USERS;
  });

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('jgm4_items');
    const initialized = localStorage.getItem('jgm4_initialized');
    if (saved) return JSON.parse(saved);
    return initialized ? [] : INITIAL_CHECKLIST_ITEMS;
  });

  const [responses, setResponses] = useState<ChecklistResponse[]>(() => {
    const saved = localStorage.getItem('jgm4_responses');
    return saved ? JSON.parse(saved) : [];
  });

  const [companyLogo, setCompanyLogo] = useState<string>(() => {
    return localStorage.getItem('jgm4_logo') || '';
  });

  const [companyName, setCompanyName] = useState<string>(() => {
    return localStorage.getItem('jgm4_name') || 'JGM4 Consultoria';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('jgm4_admin_pass') || ADMIN_CREDENTIALS.pass;
  });

  const [view, setView] = useState<AppView>(AppView.USER_SELECT);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastSubmission, setLastSubmission] = useState<ChecklistResponse | null>(null);

  useEffect(() => {
    localStorage.setItem('jgm4_initialized', 'true');
  }, []);

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
    localStorage.setItem('jgm4_name', companyName);
    localStorage.setItem('jgm4_admin_pass', adminPassword);
  }, [companyLogo, companyName, adminPassword]);

  const stats = useMemo(() => {
    const total = responses.length;
    const conforms = responses.reduce((acc, r) => acc + Object.values(r.answers).filter(v => v).length, 0);
    const totalPossibleChecks = responses.reduce((acc, r) => acc + Object.keys(r.answers).length, 0);
    const nonConforms = responses.reduce((acc, r) => acc + Object.values(r.answers).filter(v => !v).length, 0);
    
    const complianceRate = totalPossibleChecks > 0 ? (conforms / totalPossibleChecks) * 100 : 0;
    const today = new Date().toLocaleDateString();
    const uniqueUsersToday = new Set(responses.filter(r => new Date(r.timestamp).toLocaleDateString() === today).map(r => r.userId)).size;

    return { total, complianceRate, uniqueUsersToday, nonConforms };
  }, [responses]);

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
    <div className="min-h-screen bg-blue-50 text-slate-900 flex flex-col font-sans">
      <header className="bg-[#0a1929] border-b border-white/5 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-xl">
        <div className="flex items-center space-x-4">
          {companyLogo ? (
            <img src={companyLogo} alt="Logo" className="h-10 w-auto object-contain max-w-[120px] drop-shadow-md" />
          ) : (
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg">
               <i className="fas fa-check-double text-white text-xl"></i>
            </div>
          )}
          <div className="flex flex-col leading-tight">
            <h1 className="text-lg font-black text-white tracking-tighter uppercase">{companyName}</h1>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Plataforma Operacional</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {view === AppView.ADMIN_DASHBOARD && (
            <button onClick={logout} className="text-sm font-black text-white bg-white/10 hover:bg-white/20 transition-all px-5 py-2.5 rounded-xl flex items-center border border-white/10">
              <i className="fas fa-power-off mr-2 text-rose-400"></i> SAIR
            </button>
          )}
          {view === AppView.USER_SELECT && (
            <button 
              onClick={() => setView(AppView.LOGIN)} 
              className="text-xs font-black text-indigo-100 bg-white/5 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all border border-white/10 tracking-widest uppercase"
            >
              <i className="fas fa-shield-halved mr-2 text-indigo-400"></i> Gestão
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {view === AppView.LOGIN && (
          <Login 
            logo={companyLogo} 
            companyName={companyName} 
            adminPassword={adminPassword}
            onBack={() => setView(AppView.USER_SELECT)} 
            onSuccess={() => setView(AppView.ADMIN_DASHBOARD)} 
          />
        )}

        {view === AppView.USER_SELECT && (
          <div className="p-8 max-w-6xl mx-auto w-full animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border border-blue-100 shadow-sm flex items-center space-x-5">
                  <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 text-xl shadow-inner">
                    <i className="fas fa-calendar-day"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Presença Hoje</p>
                    <h4 className="text-2xl font-black text-slate-800">{stats.uniqueUsersToday} Perfis</h4>
                  </div>
               </div>
               <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border border-blue-100 shadow-sm flex items-center space-x-5">
                  <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 text-xl shadow-inner">
                    <i className="fas fa-percentage"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Conformidade</p>
                    <h4 className="text-2xl font-black text-indigo-600">{stats.complianceRate.toFixed(1)}%</h4>
                  </div>
               </div>
               <div className="bg-rose-50/50 backdrop-blur-sm p-6 rounded-[2rem] border border-rose-100 shadow-sm flex items-center space-x-5">
                  <div className="bg-rose-100 w-14 h-14 rounded-2xl flex items-center justify-center text-rose-600 text-xl shadow-inner">
                    <i className="fas fa-bell"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-1">Falhas Totais</p>
                    <h4 className="text-2xl font-black text-rose-600">{stats.nonConforms} Alertas</h4>
                  </div>
               </div>
            </div>

            <div className="mb-12 text-center">
               <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2 uppercase">Acesso ao Checklist</h2>
               <p className="text-slate-500 font-medium italic">{companyName}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm hover:shadow-2xl hover:border-indigo-500 hover:-translate-y-1 transition-all text-left flex flex-col group relative overflow-hidden"
                >
                  <div className="bg-blue-50 p-5 rounded-2xl mb-5 self-start group-hover:bg-[#0a1929] group-hover:text-white transition-all duration-300">
                    <i className="fas fa-user-tie text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800 group-hover:text-indigo-950 transition-colors mb-1">{user.name}</h3>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">{user.role}</p>
                    <div className="flex flex-col space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg inline-flex items-center self-start">
                        <i className="fab fa-whatsapp mr-2 text-indigo-500"></i> {user.phone}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg inline-flex items-center self-start overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                        <i className="fas fa-envelope mr-2 text-indigo-400 text-[8px]"></i> {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-chevron-right text-indigo-500"></i>
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
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
            <div className="w-32 h-32 bg-indigo-600 text-white rounded-[3rem] flex items-center justify-center text-6xl mb-10 shadow-3xl shadow-indigo-100">
              <i className="fas fa-check"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter uppercase">Tarefa Registrada!</h2>
            <p className="text-slate-500 max-w-sm mb-12 text-lg">
              Checklist enviado com sucesso para <strong>{companyName}</strong>.
            </p>
            
            <div className="space-y-4 w-full max-w-xs">
              <a
                href={`https://wa.me/${currentUser.phone}?text=Olá! Acabei de finalizar meu checklist ${companyName}.`}
                target="_blank"
                className="w-full flex items-center justify-center bg-[#25D366] text-white font-black py-5 px-8 rounded-[1.5rem] hover:scale-105 transition-all shadow-xl shadow-green-100"
              >
                <i className="fab fa-whatsapp mr-3 text-2xl"></i> Enviar Confirmação
              </a>
              <button onClick={() => setView(AppView.USER_SELECT)} className="w-full text-slate-400 font-black py-4 hover:text-indigo-700 transition-colors uppercase tracking-[0.2em] text-[10px]">
                Voltar à tela inicial
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
            companyName={companyName}
            setCompanyName={setCompanyName}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
          />
        )}
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-blue-100 p-8 text-center">
        <div className="flex flex-col items-center space-y-2">
           <p className="text-[10px] font-black text-indigo-900/40 uppercase tracking-[0.4em]">{companyName}</p>
           <p className="text-xs text-slate-400 font-medium">&copy; {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { ADMIN_CREDENTIALS } from '../constants';

interface LoginProps {
  logo: string;
  onBack: () => void;
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ logo, onBack, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.user && password === ADMIN_CREDENTIALS.pass) {
      onSuccess();
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {logo ? (
            <img src={logo} alt="Logo" className="h-16 mx-auto mb-4 object-contain" />
          ) : (
            <div className="bg-indigo-600 p-4 rounded-2xl inline-flex mb-4">
              <i className="fas fa-shield-alt text-white text-3xl"></i>
            </div>
          )}
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Acesso Admin</h2>
          <p className="text-slate-500 text-sm mt-1">Entre com suas credenciais de administrador.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Digite seu usuário"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Digite sua senha"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
              <i className="fas fa-exclamation-circle mr-2"></i>{error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>Entrar
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full text-slate-400 font-bold py-3 text-sm uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

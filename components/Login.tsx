import React, { useState } from 'react';

interface LoginProps {
  logo: string;
  companyName: string;
  adminPassword: string;
  onBack: () => void;
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ logo, companyName, adminPassword, onBack, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (password === adminPassword) {
        onSuccess();
      } else {
        setError('Senha incorreta. Tente novamente.');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] border border-blue-100 shadow-lg p-10">
          <div className="flex flex-col items-center mb-10">
            {logo ? (
              <img src={logo} alt="Logo" className="h-16 w-auto object-contain mb-4" />
            ) : (
              <div className="bg-[#0a1929] p-4 rounded-2xl mb-4 shadow-lg">
                <i className="fas fa-shield-halved text-white text-3xl"></i>
              </div>
            )}
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Acesso Administrativo
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-1">{companyName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-slate-300"></i>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Digite a senha..."
                  className="w-full pl-12 pr-4 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold px-4 py-3 rounded-xl flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#0a1929] text-white font-black py-4 rounded-2xl hover:bg-[#0a1929]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Verificando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <i className="fas fa-arrow-right-to-bracket mr-2"></i> Entrar
                </span>
              )}
            </button>
          </form>

          <button
            onClick={onBack}
            className="w-full mt-6 text-slate-400 font-bold text-xs hover:text-indigo-600 transition-colors uppercase tracking-[0.2em] py-2"
          >
            <i className="fas fa-arrow-left mr-2"></i> Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { User, ChecklistItem, ChecklistResponse } from '../types';

interface UserChecklistProps {
  user: User;
  items: ChecklistItem[];
  onSubmit: (response: ChecklistResponse) => void;
  onCancel: () => void;
}

const UserChecklist: React.FC<UserChecklistProps> = ({ user, items, onSubmit, onCancel }) => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');

  const toggleAnswer = (itemId: string) => {
    setAnswers(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k]).length;
  const progress = items.length > 0 ? Math.round((answeredCount / items.length) * 100) : 0;

  const handleSubmit = () => {
    const response: ChecklistResponse = {
      id: `resp_${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      answers,
      notes: notes.trim() || undefined,
      timestamp: Date.now(),
    };
    onSubmit(response);
  };

  const categories = [...new Set(items.map(item => item.category))];

  return (
    <div className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Checklist Diário</h2>
            <p className="text-sm text-slate-500 font-medium">
              <i className="fas fa-user mr-1"></i>{user.name} &bull; {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-sm text-slate-400 hover:text-slate-600 font-bold transition-colors"
          >
            <i className="fas fa-times mr-1"></i>Cancelar
          </button>
        </div>

        <div className="bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 font-bold mt-1.5 text-right">{answeredCount}/{items.length} itens</p>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <i className="fas fa-inbox text-4xl text-slate-300 mb-4"></i>
            <p className="text-slate-500 font-medium">Nenhum item de checklist atribuído a você.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 flex-1">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                <i className="fas fa-folder mr-2"></i>{category}
              </h3>
              <div className="space-y-2">
                {items
                  .filter(item => item.category === category)
                  .map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleAnswer(item.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center space-x-3 ${
                        answers[item.id]
                          ? 'bg-green-50 border-green-300 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                          answers[item.id]
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-100 border border-slate-300'
                        }`}
                      >
                        {answers[item.id] && <i className="fas fa-check text-xs"></i>}
                      </div>
                      <span className={`text-sm font-medium ${answers[item.id] ? 'text-green-800' : 'text-slate-700'}`}>
                        {item.question}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              <i className="fas fa-sticky-note mr-2"></i>Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Adicione observações se necessário..."
            />
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-200">
        <button
          onClick={handleSubmit}
          disabled={items.length === 0}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-paper-plane mr-2"></i>Enviar Checklist
        </button>
      </div>
    </div>
  );
};

export default UserChecklist;

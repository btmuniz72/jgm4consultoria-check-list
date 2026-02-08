import React, { useState } from 'react';
import { User, ChecklistItem, ChecklistResponse } from '../types';

interface UserChecklistProps {
  user: User;
  items: ChecklistItem[];
  onSubmit: (response: ChecklistResponse) => void;
  onCancel: () => void;
}

const UserChecklist: React.FC<UserChecklistProps> = ({ user, items, onSubmit, onCancel }) => {
  const [answers, setAnswers] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach(item => {
      initial[item.id] = false;
    });
    return initial;
  });
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [...new Set(items.map(item => item.category))];

  const toggleAnswer = (itemId: string) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const totalChecked = Object.values(answers).filter(Boolean).length;
  const totalItems = items.length;
  const progress = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0;

  const handleSubmit = () => {
    const requiredItems = items.filter(item => item.required);
    const allRequiredChecked = requiredItems.every(item => answers[item.id]);

    if (!allRequiredChecked) {
      alert('Por favor, preencha todos os itens obrigatórios antes de enviar.');
      return;
    }

    setSubmitting(true);

    const response: ChecklistResponse = {
      id: `resp_${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      answers,
      notes: notes || undefined,
      timestamp: Date.now(),
    };

    setTimeout(() => {
      onSubmit(response);
    }, 500);
  };

  return (
    <div className="flex-1 p-6 max-w-3xl mx-auto w-full animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-[2rem] border border-blue-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-50 p-3 rounded-xl">
              <i className="fas fa-user-tie text-indigo-600 text-lg"></i>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">{user.name}</h2>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Progress */}
        <div className="mb-2 flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progresso</span>
          <span className="text-sm font-black text-indigo-600">{totalChecked}/{totalItems}</span>
        </div>
        <div className="w-full bg-blue-50 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Categories and Items */}
      {categories.map(category => (
        <div key={category} className="mb-6">
          <div className="flex items-center space-x-2 mb-3 px-2">
            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg">
              <i className="fas fa-tag text-xs mr-1"></i>
              <span className="text-xs font-black uppercase tracking-widest">{category}</span>
            </div>
          </div>
          <div className="space-y-3">
            {items
              .filter(item => item.category === category)
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleAnswer(item.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    answers[item.id]
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                      : 'bg-white border-blue-100 hover:border-indigo-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        answers[item.id]
                          ? 'bg-indigo-600 text-white'
                          : 'bg-blue-50 border-2 border-blue-200'
                      }`}
                    >
                      {answers[item.id] && <i className="fas fa-check text-sm"></i>}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${answers[item.id] ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {item.question}
                      </p>
                      {item.required && (
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1 inline-block">
                          Obrigatório
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}

      {/* Notes */}
      <div className="bg-white rounded-[2rem] border border-blue-100 shadow-sm p-6 mb-6">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
          Observações (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Adicione qualquer observação..."
          className="w-full bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24 transition-all"
        />
      </div>

      {/* Submit */}
      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 bg-white border border-blue-100 text-slate-500 font-black py-4 rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-widest text-xs"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 uppercase tracking-widest text-xs shadow-lg shadow-indigo-100"
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> Enviando...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <i className="fas fa-paper-plane mr-2"></i> Enviar Checklist
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserChecklist;

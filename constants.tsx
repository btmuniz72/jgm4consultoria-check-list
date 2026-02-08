
import { ChecklistItem, User } from './types';

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'João Silva', role: 'Operador', phone: '5511999999999', email: 'joao@jgm4.com' },
  { id: '2', name: 'Maria Souza', role: 'Supervisor', phone: '5511888888888', email: 'maria@jgm4.com' },
];

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'q1', question: 'Equipamentos de Proteção Individual (EPI) estão completos?', category: 'Segurança', assignedUserIds: ['1', '2'] },
  { id: 'q2', question: 'Área de trabalho está limpa e organizada?', category: 'Organização', assignedUserIds: ['1', '2'] },
  { id: 'q3', question: 'Ferramentas foram verificadas e estão em bom estado?', category: 'Manutenção', assignedUserIds: ['1'] },
  { id: 'q4', question: 'Identificou algum risco potencial hoje?', category: 'Segurança', assignedUserIds: ['1', '2'] },
  { id: 'q5', question: 'O cronograma diário foi revisado?', category: 'Planejamento', assignedUserIds: ['2'] },
];

export const ADMIN_CREDENTIALS = {
  user: 'admin',
  pass: 'jgm4'
};

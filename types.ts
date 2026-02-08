
export interface User {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface ChecklistItem {
  id: string;
  question: string;
  category: string;
  assignedUserIds: string[]; // List of user IDs who should see this item
}

export interface ChecklistResponse {
  id: string;
  userId: string;
  date: string;
  answers: Record<string, boolean>; // itemId -> status
  notes?: string;
  timestamp: number;
}

export enum AppView {
  LOGIN = 'LOGIN',
  USER_SELECT = 'USER_SELECT',
  CHECKLIST_FILL = 'CHECKLIST_FILL',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  SUCCESS = 'SUCCESS'
}

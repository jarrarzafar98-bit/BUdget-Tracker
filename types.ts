export enum Category {
  MATERIALS = 'Materials',
  LABOR = 'Labor',
  MARKETING = 'Marketing',
  SOFTWARE = 'Software',
  TRAVEL = 'Travel',
  OFFICE = 'Office',
  OTHER = 'Other'
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO date string YYYY-MM-DD
  category: Category;
  paidBy: string; // Partner ID
}

export interface ProjectSettings {
  name: string;
  totalBudget: number;
  startDate: string;
  currency: string;
}

export interface AiAnalysisResult {
  status: 'On Track' | 'Warning' | 'Critical';
  summary: string;
  risks: string[];
  recommendations: string[];
}

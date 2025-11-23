import { Category, Expense, Partner, ProjectSettings } from './types';

export const INITIAL_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Alex Chen', role: 'Project Lead', avatarUrl: 'https://picsum.photos/seed/alex/100/100' },
  { id: 'p2', name: 'Sarah Jones', role: 'Marketing', avatarUrl: 'https://picsum.photos/seed/sarah/100/100' },
  { id: 'p3', name: 'Mike Ross', role: 'Developer', avatarUrl: 'https://picsum.photos/seed/mike/100/100' },
];

export const INITIAL_SETTINGS: ProjectSettings = {
  name: "Q3 Product Launch",
  totalBudget: 50000,
  startDate: "2023-09-01",
  currency: "$"
};

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', description: 'Cloud Server Setup', amount: 1200, date: '2023-09-05', category: Category.SOFTWARE, paidBy: 'p3' },
  { id: 'e2', description: 'Social Media Ads', amount: 3500, date: '2023-09-10', category: Category.MARKETING, paidBy: 'p2' },
  { id: 'e3', description: 'Prototyping Materials', amount: 850, date: '2023-09-12', category: Category.MATERIALS, paidBy: 'p1' },
  { id: 'e4', description: 'Team Offsite Lunch', amount: 240, date: '2023-09-15', category: Category.OFFICE, paidBy: 'p1' },
  { id: 'e5', description: 'Freelance Designer', amount: 1500, date: '2023-09-20', category: Category.LABOR, paidBy: 'p2' },
  { id: 'e6', description: 'Dev Tools License', amount: 600, date: '2023-09-22', category: Category.SOFTWARE, paidBy: 'p3' },
  { id: 'e7', description: 'User Testing Incentives', amount: 500, date: '2023-09-25', category: Category.OTHER, paidBy: 'p2' },
];

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  PieChart, 
  Plus, 
  DollarSign, 
  Wallet,
  Activity,
  Trash2
} from 'lucide-react';
import { INITIAL_EXPENSES, INITIAL_PARTNERS, INITIAL_SETTINGS } from './constants';
import { Expense, ProjectSettings } from './types';
import { StatCard } from './components/StatCard';
import { AddExpenseModal } from './components/AddExpenseModal';
import { PartnerContribution, SpendingByCategory } from './components/Charts';
import { AiAdvisor } from './components/AiAdvisor';

enum Tab {
  DASHBOARD = 'Dashboard',
  EXPENSES = 'Expenses',
  PARTNERS = 'Partners'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [partners] = useState(INITIAL_PARTNERS);
  const [settings] = useState<ProjectSettings>(INITIAL_SETTINGS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Calculations
  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const remainingBudget = settings.totalBudget - totalSpent;
  const progressPercentage = Math.min((totalSpent / settings.totalBudget) * 100, 100);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9)
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
      setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const getPartnerName = (id: string) => partners.find(p => p.id === id)?.name || 'Unknown';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 md:h-screen sticky top-0 md:fixed z-20">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-wide">UnityBudget</span>
          </div>
          
          <nav className="space-y-2">
            {[Tab.DASHBOARD, Tab.EXPENSES, Tab.PARTNERS].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab === Tab.DASHBOARD && <LayoutDashboard className="w-5 h-5" />}
                {tab === Tab.EXPENSES && <Receipt className="w-5 h-5" />}
                {tab === Tab.PARTNERS && <Users className="w-5 h-5" />}
                <span className="font-medium">{tab}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 bg-slate-800 md:block hidden">
            <p className="text-xs text-slate-400 uppercase font-bold mb-2">Project</p>
            <p className="text-sm font-semibold text-white truncate">{settings.name}</p>
            <p className="text-xs text-slate-400 mt-1">{settings.startDate}</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{activeTab}</h1>
            <p className="text-slate-500 mt-1">Manage project finances collaboratively.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </header>

        {/* Dashboard View */}
        {activeTab === Tab.DASHBOARD && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Total Budget" 
                value={`${settings.currency}${settings.totalBudget.toLocaleString()}`} 
                icon={<Wallet />}
                colorClass="bg-indigo-500 text-indigo-500"
              />
              <StatCard 
                title="Total Spent" 
                value={`${settings.currency}${totalSpent.toLocaleString()}`} 
                subtitle={`${progressPercentage.toFixed(1)}% utilized`}
                trend={progressPercentage > 80 ? 'up' : 'neutral'}
                icon={<DollarSign />}
                colorClass="bg-emerald-500 text-emerald-500"
              />
              <StatCard 
                title="Remaining" 
                value={`${settings.currency}${remainingBudget.toLocaleString()}`} 
                trend="down"
                icon={<Activity />}
                colorClass="bg-amber-500 text-amber-500"
              />
            </div>

            {/* AI Advisor */}
            <AiAdvisor expenses={expenses} settings={settings} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Spending by Category</h3>
                <SpendingByCategory expenses={expenses} />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Partner Contribution</h3>
                <PartnerContribution expenses={expenses} partners={partners} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Paid By</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {expenses.slice(0, 5).map((expense) => (
                                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-800">{expense.description}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{expense.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                {getPartnerName(expense.paidBy).charAt(0)}
                                            </div>
                                            <span className="text-sm text-slate-600">{getPartnerName(expense.paidBy)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-slate-800">
                                        {settings.currency}{expense.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {/* Expenses View */}
        {activeTab === Tab.EXPENSES && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Paid By</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {expenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-slate-800">{expense.description}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{expense.date}</td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center space-x-2">
                                        <img 
                                            src={partners.find(p => p.id === expense.paidBy)?.avatarUrl} 
                                            alt="" 
                                            className="w-6 h-6 rounded-full object-cover border border-white shadow-sm"
                                        />
                                        <span className="text-sm text-slate-600">{getPartnerName(expense.paidBy)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-slate-800">
                                    {settings.currency}{expense.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleDeleteExpense(expense.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {expenses.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    No expenses recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
           </div>
        )}

        {/* Partners View */}
        {activeTab === Tab.PARTNERS && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {partners.map(partner => {
                  const partnerExpenses = expenses.filter(e => e.paidBy === partner.id);
                  const partnerTotal = partnerExpenses.reduce((sum, e) => sum + e.amount, 0);
                  const partnerCount = partnerExpenses.length;
                  const contributionPercent = ((partnerTotal / totalSpent) * 100) || 0;

                  return (
                    <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
                        <img 
                            src={partner.avatarUrl} 
                            alt={partner.name} 
                            className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-indigo-50"
                        />
                        <h3 className="text-lg font-bold text-slate-900">{partner.name}</h3>
                        <p className="text-sm text-slate-500 mb-6">{partner.role}</p>
                        
                        <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-semibold">Total Paid</p>
                                <p className="text-xl font-bold text-indigo-600">{settings.currency}{partnerTotal.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-semibold">Transactions</p>
                                <p className="text-xl font-bold text-slate-700">{partnerCount}</p>
                            </div>
                        </div>
                        <div className="w-full mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-indigo-500 h-full rounded-full" 
                                style={{ width: `${contributionPercent}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">{contributionPercent.toFixed(1)}% of total spend</p>
                    </div>
                  );
              })}
          </div>
        )}
      </main>

      <AddExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddExpense}
        partners={partners}
      />
    </div>
  );
};

export default App;

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, trend, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {subtitle && (
            <div className="flex items-center mt-2 space-x-2">
              {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-red-500" />}
              {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-emerald-500" />}
              {trend === 'neutral' && <Minus className="w-4 h-4 text-slate-400" />}
              <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6 ${colorClass.replace('bg-', 'text-')}` })}
        </div>
      </div>
    </div>
  );
};
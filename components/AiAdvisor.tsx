import React, { useState } from 'react';
import { Sparkles, Loader2, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Expense, ProjectSettings, AiAnalysisResult } from '../types';
import { analyzeBudgetHealth } from '../services/geminiService';

interface AiAdvisorProps {
  expenses: Expense[];
  settings: ProjectSettings;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ expenses, settings }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeBudgetHealth(expenses, settings);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Warning': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Smart Advisor</h2>
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Analyzing...' : 'Generate Report'}</span>
          </button>
        </div>

        {!analysis && !loading && (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Click "Generate Report" to get AI-powered insights on your project's financial health.</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Section */}
            <div className={`p-4 rounded-xl border flex items-start space-x-4 ${getStatusColor(analysis.status)}`}>
               <div className="mt-1">
                 {analysis.status === 'On Track' && <CheckCircle className="w-6 h-6" />}
                 {analysis.status === 'Warning' && <AlertCircle className="w-6 h-6" />}
                 {analysis.status === 'Critical' && <AlertTriangle className="w-6 h-6" />}
               </div>
               <div>
                 <h3 className="font-bold text-lg mb-1">{analysis.status}</h3>
                 <p className="opacity-90 leading-relaxed">{analysis.summary}</p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Risks */}
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Potential Risks</h4>
                <ul className="space-y-3">
                  {analysis.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg text-red-800 text-sm">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Recommendations</h4>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start space-x-2 p-3 bg-indigo-50 rounded-lg text-indigo-800 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

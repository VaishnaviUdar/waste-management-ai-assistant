import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Apple, 
  Recycle, 
  Cpu, 
  HeartPulse, 
  ShieldAlert,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { CATEGORIES } from '../data/wasteData';

interface CategoryExplorerProps {
  onAskAboutCategory: (question: string) => void;
}

export const CategoryExplorer: React.FC<CategoryExplorerProps> = ({ onAskAboutCategory }) => {
  const [selectedId, setSelectedId] = useState<string>('wet-waste');

  const selectedCategory = CATEGORIES.find((c) => c.id === selectedId) || CATEGORIES[0];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Apple':
        return <Apple className="w-5 h-5" />;
      case 'Recycle':
        return <Recycle className="w-5 h-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-2">
            Standard Municipal Segregation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The 5 Standard Waste Segregation Pillars
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
            Mixing waste contaminates recyclable paper and plastics while exposing sanitation staff to chemical, electrical, and pathogen hazards. Master the five essential streams below.
          </p>
        </div>

        {/* 5 Category Segmented Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedId;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedId(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-white text-slate-600 border border-slate-200'}`}>
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {cat.binColor.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight">{cat.shortName}</div>
                  <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    {cat.hazardLevel === 'None' ? 'Zero Hazard' : `${cat.hazardLevel} Hazard`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Card for Active Category */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
                {getCategoryIcon(selectedCategory.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-900">{selectedCategory.binColor}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedCategory.hazardLevel} Hazard</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {selectedCategory.name}
                </h2>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
                  {selectedCategory.description}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                onAskAboutCategory(
                  `What are the best practices and common mistakes for managing ${selectedCategory.shortName}?`
                )
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-xs"
            >
              <span>Ask EcoGuide AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedCategory.hazardDetails && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-rose-950">Environmental & Worker Hazard:</strong>
                <span>{selectedCategory.hazardDetails}</span>
              </div>
            </div>
          )}
        </div>

        {/* 3-Column Content Breakdown */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: What Goes In */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Accepted Materials</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {selectedCategory.examples.map((ex, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: What Stays Out */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Do Not Include</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {selectedCategory.doNotInclude.map((no, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>{no}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Actionable Preparation Guidelines */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Info className="w-4 h-4 text-sky-600" />
              <span>Preparation Protocol</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {selectedCategory.prepGuidelines.map((guide, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 shrink-0">{i + 1}.</span>
                  <span>{guide}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';
import { COMMON_WASTE_ITEMS } from '../data/wasteData';
import { WasteCategory } from '../types/waste';

interface WasteDirectoryProps {
  onAskAI: (itemQuery: string) => void;
}

export const WasteDirectory: React.FC<WasteDirectoryProps> = ({ onAskAI }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hazardousOnly, setHazardousOnly] = useState<boolean>(false);

  const categoriesList = [
    'All',
    'Wet Waste (Organic / Biodegradable)',
    'Dry Waste (Recyclable / Non-Biodegradable)',
    'Domestic Hazardous Waste (Chemicals, Paints, Medicines)',
    'E-Waste (Electronics, Batteries, Cables)',
    'Sanitary / Medical Waste',
  ];

  const filteredItems = useMemo(() => {
    return COMMON_WASTE_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.prepStep.toLowerCase().includes(search.toLowerCase()) ||
        item.disposalAdvice.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesHazard = !hazardousOnly || item.isHazardous;

      return matchesSearch && matchesCategory && matchesHazard;
    });
  }, [search, selectedCategory, hazardousOnly]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Search Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-2">
            Catalog & Prep Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Waste Sorting & Disposal Directory
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
            Quick reference guide for common household items. Learn exact cleaning rules, terminal taping instructions, and eco-friendly substitutes.
          </p>
        </div>

        {/* Search & Hazard Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items (e.g. pizza box, batteries, bleach, tetra pak)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-sm bg-slate-50/50 placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setHazardousOnly(!hazardousOnly)}
            className={`px-4 py-2.5 rounded-lg border font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors ${
              hazardousOnly
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Hazardous Only</span>
          </button>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat;
            const shortLabel = cat === 'All' ? 'All Items' : cat.split(' ')[0] + ' ' + (cat.split(' ')[1] || '');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              {/* Unboxed Metadata Header */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-900">{item.binColor}</span>
                {item.isHazardous ? (
                  <span className="text-rose-700 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Hazard Alert
                  </span>
                ) : (
                  <span>Non-hazardous</span>
                )}
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="font-bold text-base text-slate-900">{item.name}</h3>
                <span className="text-xs text-slate-500 block">{item.category}</span>
              </div>

              {/* Prep Step */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="font-semibold text-slate-900 block">Preparation:</span>
                <p className="leading-relaxed">{item.prepStep}</p>
              </div>

              {/* Hazard Warning */}
              {item.hazardNote && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{item.hazardNote}</span>
                </div>
              )}

              {/* Eco Alternative */}
              {item.ecoAlternative && (
                <div className="text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                  <strong className="block mb-0.5 text-emerald-950">Sustainable Alternative:</strong>
                  <span>{item.ecoAlternative}</span>
                </div>
              )}
            </div>

            {/* Bottom Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Step-by-step guidance</span>
              <button
                onClick={() => onAskAI(`What is the step-by-step procedure to recycle or dispose of ${item.name}?`)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                <span>Ask EcoGuide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  ArrowRight,
  Info
} from 'lucide-react';

interface WasteAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAI: (prompt: string) => void;
}

export const WasteAuditModal: React.FC<WasteAuditModalProps> = ({ isOpen, onClose, onAskAI }) => {
  const [wetKg, setWetKg] = useState<number>(4);
  const [dryKg, setDryKg] = useState<number>(3);
  const [landfillKg, setLandfillKg] = useState<number>(2);
  const [householdSize, setHouseholdSize] = useState<number>(3);

  if (!isOpen) return null;

  const totalWeeklyKg = wetKg + dryKg + landfillKg;
  const divertedKg = wetKg + dryKg;
  const diversionRate = totalWeeklyKg > 0 ? Math.round((divertedKg / totalWeeklyKg) * 100) : 0;

  const annualDivertedKg = divertedKg * 52;
  const annualCo2SavedKg = Math.round(annualDivertedKg * 1.8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">Household Waste Diversion Audit</h2>
            <p className="text-xs text-slate-500 mt-0.5">Calculate your weekly diversion rate & annual carbon offset</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Parameters */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Household Members:</span>
              <span className="text-slate-900 font-bold tabular-nums">{householdSize} persons</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={householdSize}
              onChange={(e) => setHouseholdSize(parseInt(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-emerald-800 block">Wet (Composted)</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={wetKg}
                  onChange={(e) => setWetKg(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 px-2 py-1 text-base font-bold text-slate-900 rounded border border-slate-300 bg-white tabular-nums"
                />
                <span className="text-xs text-slate-500">kg/wk</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-sky-800 block">Dry (Recycled)</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={dryKg}
                  onChange={(e) => setDryKg(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 px-2 py-1 text-base font-bold text-slate-900 rounded border border-slate-300 bg-white tabular-nums"
                />
                <span className="text-xs text-slate-500">kg/wk</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-700 block">Landfill (Trash)</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={landfillKg}
                  onChange={(e) => setLandfillKg(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 px-2 py-1 text-base font-bold text-slate-900 rounded border border-slate-300 bg-white tabular-nums"
                />
                <span className="text-xs text-slate-500">kg/wk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-wider">Landfill Diversion Rate</span>
              <div className="text-3xl font-extrabold tracking-tight mt-0.5 tabular-nums">
                {diversionRate}%
              </div>
            </div>
            <div className="text-right text-xs text-slate-300">
              Target: <strong className="text-emerald-400">80% Benchmark</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Diverted from Landfills:</span>
              <strong className="text-sm font-bold text-white tabular-nums">{annualDivertedKg} kg/year</strong>
            </div>
            <div>
              <span className="text-slate-400 block">CO₂ Equivalent Prevented:</span>
              <strong className="text-sm font-bold text-emerald-400 tabular-nums">~{annualCo2SavedKg} kg CO₂e/yr</strong>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Kitchen scraps make up roughly 50% to 60% of average household trash weight. Composting at home is the most effective way to eliminate your landfill load.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onAskAI(`My household of ${householdSize} generates ${landfillKg} kg of landfill trash and ${wetKg} kg of wet waste weekly. What are the best strategies to increase my diversion rate above 80%?`);
            }}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            Get Personalized AI Reduction Plan
          </button>
        </div>
      </div>
    </div>
  );
};

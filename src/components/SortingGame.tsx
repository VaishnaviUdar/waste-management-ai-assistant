import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { QUIZ_ITEMS } from '../data/wasteData';
import { WasteCategory } from '../types/waste';

interface SortingGameProps {
  onAskAI: (item: string) => void;
}

export const SortingGame: React.FC<SortingGameProps> = ({ onAskAI }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<WasteCategory | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const currentItem = QUIZ_ITEMS[currentIndex];

  const BINS: { name: WasteCategory; label: string; binColor: string; bg: string; text: string; icon: string }[] = [
    {
      name: 'Wet Waste (Organic / Biodegradable)',
      label: 'Green Bin',
      binColor: 'Organic / Wet Waste',
      bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-300',
      text: 'text-emerald-900',
      icon: '🍏',
    },
    {
      name: 'Dry Waste (Recyclable / Non-Biodegradable)',
      label: 'Blue Bin',
      binColor: 'Dry Recyclables',
      bg: 'bg-sky-50 hover:bg-sky-100/70 border-sky-300',
      text: 'text-sky-900',
      icon: '📦',
    },
    {
      name: 'Domestic Hazardous Waste (Chemicals, Paints, Medicines)',
      label: 'Red Bin',
      binColor: 'Domestic Hazardous',
      bg: 'bg-rose-50 hover:bg-rose-100/70 border-rose-300',
      text: 'text-rose-900',
      icon: '⚠️',
    },
    {
      name: 'E-Waste (Electronics, Batteries, Cables)',
      label: 'Yellow Bin',
      binColor: 'E-Waste & Batteries',
      bg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-300',
      text: 'text-amber-900',
      icon: '🔋',
    },
    {
      name: 'Sanitary / Medical Waste',
      label: 'Purple Bin',
      binColor: 'Sanitary & Medical',
      bg: 'bg-purple-50 hover:bg-purple-100/70 border-purple-300',
      text: 'text-purple-900',
      icon: '🩹',
    },
  ];

  const handleSelectBin = (category: WasteCategory) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(category);
    const correct = category === currentItem.correctCategory;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 10);
      setStreak((st) => {
        const next = st + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);

    if (currentIndex + 1 < QUIZ_ITEMS.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
    setCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Metric Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-1">
            Interactive Practice
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sort The Bin Challenge
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Classify household items into standard streams and prevent contamination.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">{score} pts</span>
          </div>

          <div className="text-right px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
            <span className="text-lg font-bold text-emerald-700 tabular-nums">{streak}</span>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Item {currentIndex + 1} of {QUIZ_ITEMS.length}</span>
              <span className="tabular-nums">{Math.round(((currentIndex) / QUIZ_ITEMS.length) * 100)}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_ITEMS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Item Challenge Card */}
          <div className="text-center py-8 px-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Which bin does this item belong to?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              "{currentItem.item}"
            </h3>

            {!showHint && selectedAnswer === null && (
              <button
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors pt-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Show Hint</span>
              </button>
            )}

            {showHint && (
              <p className="text-xs sm:text-sm text-slate-600 italic bg-amber-50 text-amber-900 p-2.5 rounded-lg border border-amber-200 inline-block max-w-md">
                Hint: {currentItem.hint}
              </p>
            )}
          </div>

          {/* 5 Bins Selection Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400 block">
              Choose the correct destination bin:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BINS.map((bin) => {
                const isThisSelected = selectedAnswer === bin.name;
                const isThisCorrect = currentItem.correctCategory === bin.name;

                let binStyle = `${bin.bg} border`;
                if (selectedAnswer !== null) {
                  if (isThisCorrect) {
                    binStyle = 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/20';
                  } else if (isThisSelected && !isThisCorrect) {
                    binStyle = 'bg-rose-100 border-rose-500 ring-2 ring-rose-500/20';
                  } else {
                    binStyle = 'opacity-40 border-slate-200 bg-slate-50';
                  }
                }

                return (
                  <button
                    key={bin.name}
                    onClick={() => handleSelectBin(bin.name)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-xl text-left flex items-center gap-3 transition-all ${binStyle}`}
                  >
                    <span className="text-2xl">{bin.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-900">{bin.label}</div>
                      <span className="text-xs text-slate-500 block">{bin.binColor}</span>
                    </div>

                    {selectedAnswer !== null && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {selectedAnswer !== null && isThisSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Explanation Card */}
          {selectedAnswer !== null && (
            <div
              className={`p-5 rounded-xl border transition-all ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Correct (+10 pts)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Incorrect — It belongs in {currentItem.correctCategory}</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm leading-relaxed mb-3">
                {currentItem.explanation}
              </p>

              {currentItem.hazardAlert && (
                <div className="p-3 rounded-lg bg-white/80 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Hazard: {currentItem.hazardAlert}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <button
                  onClick={() => onAskAI(`Can you explain more details about how to recycle or dispose of "${currentItem.item}"?`)}
                  className="text-xs font-semibold text-slate-700 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>Ask EcoGuide AI for more details</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{currentIndex + 1 < QUIZ_ITEMS.length ? 'Next Item' : 'See Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Challenge Complete
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              You scored <span className="font-bold text-slate-900 tabular-nums">{score}</span> out of{' '}
              <span className="font-bold text-slate-900 tabular-nums">{QUIZ_ITEMS.length * 10}</span> points with a best streak of{' '}
              <span className="font-bold text-emerald-700 tabular-nums">{bestStreak}</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 max-w-md mx-auto text-xs sm:text-sm flex items-center gap-3 text-left">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <strong className="block font-bold text-slate-900">Segregation Competency Achieved</strong>
              <span>You understand how to separate compostable greens, e-waste hazards, and recyclable dry matter.</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

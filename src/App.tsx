import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChatAssistant } from './components/ChatAssistant';
import { CategoryExplorer } from './components/CategoryExplorer';
import { WasteDirectory } from './components/WasteDirectory';
import { SortingGame } from './components/SortingGame';
import { ActionGuides } from './components/ActionGuides';
import { WasteAuditModal } from './components/WasteAuditModal';
import { WasteCategory } from './types/waste';
import { ArrowRight, Sparkles, Layers, Gamepad2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [auditModalOpen, setAuditModalOpen] = useState<boolean>(false);
  const [injectedPrompt, setInjectedPrompt] = useState<string | null>(null);

  const handleAskAIWithPrompt = (prompt: string) => {
    setInjectedPrompt(prompt);
    setActiveTab('chat');
  };

  const handleSelectCategory = (category: WasteCategory) => {
    setActiveTab('categories');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Bar Contract (3 zones) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAudit={() => setAuditModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Editorial Hero Banner (Visible at top of AI Assistant / Home) */}
        {activeTab === 'chat' && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-900 text-white shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Text Zone */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 z-10">
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Source Segregation Intelligence
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white [text-wrap:balance]">
                    Waste Segregation, Safe Disposal, and Circular Living
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                    Protect sanitation workers from battery fires and broken glass. Separate kitchen organics, clean dry recyclables, e-waste, and hazardous chemicals before disposal.
                  </p>
                </div>

                {/* Quick Stream Jump Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    <Layers className="w-4 h-4" />
                    <span>The 5 Pillars</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('game')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Sort Challenge</span>
                  </button>
                  <button
                    onClick={() => handleAskAIWithPrompt("What are the most common household items people mistakenly throw into the wrong bin?")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    <span>Common Sorting Errors</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Image Zone with High-Fidelity Asset */}
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
                <img
                  src="/src/assets/images/hero_waste_segregation_1792070429873.jpg"
                  alt="Modern sustainable kitchen waste sorting station with minimalist receptacles"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: AI Assistant & Workspace */}
        {activeTab === 'chat' && (
          <ChatAssistant
            onCategorySelect={handleSelectCategory}
            onExploreItem={(item) => handleAskAIWithPrompt(`How do I properly dispose of ${item}?`)}
            initialPrompt={injectedPrompt}
            onClearInitialPrompt={() => setInjectedPrompt(null)}
          />
        )}

        {/* Tab 2: 5 Categories */}
        {activeTab === 'categories' && (
          <CategoryExplorer
            onAskAboutCategory={handleAskAIWithPrompt}
          />
        )}

        {/* Tab 3: Waste Directory */}
        {activeTab === 'directory' && (
          <WasteDirectory
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {/* Tab 4: Sorting Challenge Mini-Game */}
        {activeTab === 'game' && (
          <SortingGame
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {/* Tab 5: Action Handbooks & Composting Guides */}
        {activeTab === 'guides' && (
          <ActionGuides
            onAskAI={handleAskAIWithPrompt}
          />
        )}
      </main>

      {/* Waste Audit Modal */}
      <WasteAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        onAskAI={handleAskAIWithPrompt}
      />

      {/* Quiet, Editorial Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">EcoGuide AI</span>
            <span aria-hidden="true">·</span>
            <span>Segregate First · Prevent Hazards · Recover Resources</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Wet Waste</span>
            <span aria-hidden="true">/</span>
            <span>Dry Waste</span>
            <span aria-hidden="true">/</span>
            <span>Domestic Hazardous</span>
            <span aria-hidden="true">/</span>
            <span>E-Waste</span>
            <span aria-hidden="true">/</span>
            <span>Sanitary</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

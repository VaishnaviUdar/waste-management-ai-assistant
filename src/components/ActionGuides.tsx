import React, { useState } from 'react';
import { 
  Sprout, 
  BatteryCharging, 
  Sparkles, 
  Droplet, 
  AlertTriangle, 
  ShieldAlert,
  Flame,
  CheckSquare
} from 'lucide-react';
import { COMPOSTING_GUIDELINES } from '../data/wasteData';

interface ActionGuidesProps {
  onAskAI: (prompt: string) => void;
}

export const ActionGuides: React.FC<ActionGuidesProps> = ({ onAskAI }) => {
  const [activeGuide, setActiveGuide] = useState<'composting' | 'ewaste' | 'recycling' | 'hazardous'>('composting');
  const [kitchenGreenLiters, setKitchenGreenLiters] = useState<number>(2);

  const requiredBrownLiters = (kitchenGreenLiters * 2.5).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-2">
            Standard Procedures
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Actionable Sustainable Practices & Handling Guides
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
            Follow verified step-by-step procedures to eliminate landfill waste, prevent garbage truck fires, and produce rich organic soil at home.
          </p>
        </div>

        {/* Guide Switcher Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <button
            onClick={() => setActiveGuide('composting')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeGuide === 'composting'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="text-sm font-bold tracking-tight">Home Composting</div>
            <span className={`text-xs block mt-0.5 ${activeGuide === 'composting' ? 'text-slate-300' : 'text-slate-500'}`}>
              Kitchen & Garden
            </span>
          </button>

          <button
            onClick={() => setActiveGuide('ewaste')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeGuide === 'ewaste'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="text-sm font-bold tracking-tight">E-Waste Safety</div>
            <span className={`text-xs block mt-0.5 ${activeGuide === 'ewaste' ? 'text-slate-300' : 'text-slate-500'}`}>
              Batteries & Tech
            </span>
          </button>

          <button
            onClick={() => setActiveGuide('recycling')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeGuide === 'recycling'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="text-sm font-bold tracking-tight">Recyclables Prep</div>
            <span className={`text-xs block mt-0.5 ${activeGuide === 'recycling' ? 'text-slate-300' : 'text-slate-500'}`}>
              The 3-Step Clean
            </span>
          </button>

          <button
            onClick={() => setActiveGuide('hazardous')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeGuide === 'hazardous'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="text-sm font-bold tracking-tight">Hazardous & Meds</div>
            <span className={`text-xs block mt-0.5 ${activeGuide === 'hazardous' ? 'text-slate-300' : 'text-slate-500'}`}>
              Never Flush Rules
            </span>
          </button>
        </div>
      </div>

      {/* Guide 1: Composting */}
      {activeGuide === 'composting' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Biological Process</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                  Home Composting: The Odor-Free Aerobic Method
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Transform vegetable peelings, fruit cores, and cardboard into nutrient-rich humus within 6 to 8 weeks.
                </p>
              </div>

              <button
                onClick={() => onAskAI("How do I build an odor-free compost bin in an apartment balcony or garden?")}
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto shadow-xs"
              >
                <span>Ask AI Balcony Setup</span>
              </button>
            </div>

            {/* Generated Visual Banner with Fallback */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-64 sm:h-80">
              <img
                src="/src/assets/images/compost_rich_soil_1792070430050.jpg"
                alt="Organic composting soil with vegetable scraps"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
                <div className="text-white max-w-lg">
                  <span className="text-xs font-semibold text-emerald-400 block mb-1">Carbon-Nitrogen Equilibrium</span>
                  <p className="text-sm sm:text-base font-medium leading-relaxed">
                    Aerobic decomposition requires 2.5 to 3 parts dry brown carbon matter for every 1 part green wet nitrogen scrap.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Carbon : Nitrogen Calculator */}
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Sprout className="w-5 h-5 text-emerald-700" />
                <span>Carbon : Nitrogen (Brown : Green) Balance Calculator</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                The primary cause of foul odors is dumping wet green scraps without balancing dry carbon browns. Adjust your volume below:
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700">
                  <span>Your Green Scraps (Veggie peels, coffee grounds, food scraps):</span>
                  <span className="text-emerald-800 font-bold tabular-nums">{kitchenGreenLiters} Liters</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={kitchenGreenLiters}
                  onChange={(e) => setKitchenGreenLiters(parseFloat(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">Required Dry Brown Matter to add:</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums">
                    ~ {requiredBrownLiters} Liters of Shredded Cardboard or Dry Leaves
                  </span>
                </div>
                <div className="text-slate-600 text-xs max-w-xs">
                  Tip: Always cap your fresh green scraps with a 2-inch layer of dry shredded cardboard or leaves to block gnats and fruit flies.
                </div>
              </div>
            </div>

            {/* 4 Core Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-sm text-slate-900">1. Chop & Alternate Layers</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chop food scraps into 1-inch pieces. Alternate layers of food scraps with torn unprinted cardboard, dried leaves, or egg cartons.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-sm text-slate-900">2. Moisture Control</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The compost pile should feel as moist as a wrung-out sponge. If it drips water, mix in dry shredded brown paper.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-sm text-slate-900">3. Weekly Oxygen Aeration</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Turn the pile with a small garden fork or stick once every 7 to 10 days to inject oxygen and eliminate methane odor.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-sm text-slate-900">4. Prohibited Items</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Never add dairy, meat, bones, pet feces, or chemically treated wood to simple home piles to avoid attracting pests.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide 2: E-Waste & Batteries */}
      {activeGuide === 'ewaste' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Hazard Protocol</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                E-Waste & Battery Fire Prevention Protocol
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Lithium-ion batteries are the leading cause of compactor truck fires worldwide.
              </p>
            </div>

            <button
              onClick={() => onAskAI("What do I do with a swollen power bank or battery safely?")}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto shadow-xs"
            >
              <span>Ask AI Battery Danger</span>
            </button>
          </div>

          {/* Generated E-Waste Technical Visual with Fallback */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-64 sm:h-80">
            <img
              src="/src/assets/images/ewaste_circular_tech_1792070431252.jpg"
              alt="E-waste circular technology and terminal insulated lithium cells"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
              <div className="text-white max-w-lg">
                <span className="text-xs font-semibold text-amber-400 block mb-1">Terminal Insulation Standard</span>
                <p className="text-sm sm:text-base font-medium leading-relaxed">
                  Cover both contact points with non-conductive electrical tape before dropping batteries at dedicated recycling kiosks.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
            <Flame className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-bold block">The Truck Compaction Hazard</strong>
              <p className="text-xs sm:text-sm text-amber-900 mt-0.5 leading-relaxed">
                When a lithium-ion battery gets thrown into standard garbage, hydraulic truck blades crush the cell separator. This triggers instant thermal runaway, igniting surrounding paper and plastics into intense chemical fires.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-sm text-slate-900">1. Tape Electrical Terminals</div>
              <p className="text-xs text-slate-600">
                Place clear Scotch tape or vinyl electrical tape over positive and negative poles of 9V, AA, and lithium batteries.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-sm text-slate-900">2. Isolate Swollen Cells</div>
              <p className="text-xs text-slate-600">
                If a device battery is puffy or hot, place it in a fireproof metal canister or bucket of dry sand away from paper.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-sm text-slate-900">3. Drop-Off at Certified Kiosks</div>
              <p className="text-xs text-slate-600">
                Take batteries and electronics to municipal e-waste centers or retailer takeback bins (e.g. Call2Recycle, Best Buy).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-sm text-slate-900">4. Bundle Charging Cables</div>
              <p className="text-xs text-slate-600">
                Coil and tie charging cords; loose wires jam rotary sorting screens in dry recyclables facilities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guide 3: Recyclables Prep */}
      {activeGuide === 'recycling' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-sky-800 uppercase tracking-wide">Quality Control</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                The 3-Step Recyclables Cleaning Standard
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Residual oils contaminate paper recycling bales and attract pests at sorting facilities.
              </p>
            </div>

            <button
              onClick={() => onAskAI("How clean do plastic containers need to be for dry recycling?")}
              className="px-4 py-2 rounded-lg bg-sky-700 text-white hover:bg-sky-800 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <span>Ask Contamination Rules</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="text-xs font-bold uppercase text-slate-400">Step 1</div>
              <h3 className="font-bold text-base text-slate-900">Empty Completely</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scrape out all food remnants, yogurt, grease, or liquids into wet waste. Never leave liquid weight inside drink bottles.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="text-xs font-bold uppercase text-slate-400">Step 2</div>
              <h3 className="font-bold text-base text-slate-900">Quick Swish Rinse</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A brief rinse with grey dishwater removes sticky sugars and oils. No need to run through the dishwasher.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="text-xs font-bold uppercase text-slate-400">Step 3</div>
              <h3 className="font-bold text-base text-slate-900">Dry & Squash</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Shake out water droplets so surrounding cardboard stays dry. Flatten containers to multiply bin capacity by 3x.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guide 4: Hazardous Waste & Never Flush */}
      {activeGuide === 'hazardous' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wide">Toxic & Chemical Shield</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                The "Never Flush" & Hazardous Waste Shield
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Protect municipal water reservoirs, aquatic life, and sanitation teams from chemical poisoning.
              </p>
            </div>

            <button
              onClick={() => onAskAI("Where can I find safe medicine take-back drop boxes near me?")}
              className="px-4 py-2 rounded-lg bg-rose-700 text-white hover:bg-rose-800 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <span>Ask Medicine Take-Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/60 space-y-2 text-xs sm:text-sm text-slate-700">
              <strong className="text-rose-950 font-bold block text-base">Never Flush Pharmaceuticals</strong>
              <p className="leading-relaxed">
                Wastewater treatment plants remove bacteria and organic solids, but cannot filter dissolved antibiotics, hormones, or chemotherapy compounds. Flushed drugs pass directly into drinking water sources and harm aquatic wildlife.
              </p>
              <div className="p-3 rounded-lg bg-white border border-rose-200 font-medium text-rose-900 text-xs mt-2">
                Action: Return expired prescription pills in original bottles to community pharmacy drop-boxes.
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs sm:text-sm text-slate-700">
              <strong className="text-slate-900 font-bold block text-base">Household Chemical Safety</strong>
              <ul className="space-y-1.5 leading-relaxed">
                <li>• <strong>Never mix cleaners:</strong> Combining bleach with ammonia produces lethal chloramine gas.</li>
                <li>• <strong>No oil in drains:</strong> Liquid cooking fat hardens with wipes in sewers, causing fatbergs.</li>
                <li>• <strong>Aerosols:</strong> Ensure spray cans are completely empty before recycling; pressurized cans explode under compaction.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

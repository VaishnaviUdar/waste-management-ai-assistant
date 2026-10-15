import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Camera, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  AlertTriangle, 
  RefreshCw,
  Image as ImageIcon,
  X,
  ShieldAlert,
  ArrowRight,
  Upload,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';
import { marked } from 'marked';
import { ChatMessage, WasteCategory, ClassificationResult } from '../types/waste';
import { CATEGORIES, COMMON_WASTE_ITEMS } from '../data/wasteData';

interface ChatAssistantProps {
  onCategorySelect?: (category: WasteCategory) => void;
  onExploreItem?: (itemName: string) => void;
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

const STARTER_PROMPTS = [
  "How to properly dispose of lithium-ion batteries and chargers?",
  "Can I recycle greasy pizza boxes or should I compost them?",
  "What is the safe protocol for expired prescription pills and cough syrups?",
  "How do I clean sticky peanut butter jars and milk jugs for dry recycling?",
  "How can I safely package broken window glass so collectors don't get cut?",
  "What is the ideal green-to-brown ratio for backyard composting?",
];

const INITIAL_GREETING: ChatMessage = {
  id: 'init-1',
  role: 'model',
  timestamp: new Date(),
  content: `Hello! I am **EcoGuide AI**, your waste management and segregation assistant.

Whenever you have an item to discard, I classify it into one of the **5 standard streams**:
* **Wet Waste** (Organic / Biodegradable — Kitchen & Garden)
* **Dry Waste** (Recyclable / Non-Biodegradable — Clean Plastics, Paper, Metals, Glass)
* **Domestic Hazardous Waste** (Chemicals, Paints, Medicines, Aerosols)
* **E-Waste** (Electronics, Batteries, Cables, Appliances)
* **Sanitary / Medical Waste** (Pads, Diapers, Bandages, Sharps)

You can type any item name, snap or upload a photo in the scanner panel, or choose a topic below to begin.`,
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  onCategorySelect, 
  initialPrompt, 
  onClearInitialPrompt 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Scanner panel state
  const [scannerLoading, setScannerLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ClassificationResult | null>(null);
  const [activeSideTab, setActiveSideTab] = useState<'scanner' | 'reference' | 'safety'>('scanner');
  const [quickInspectItem, setQuickInspectItem] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sideScannerInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSendMessage(initialPrompt);
      onClearInitialPrompt?.();
    }
  }, [initialPrompt]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, forScanner: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Image must be smaller than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (forScanner) {
          analyzeImageInScanner(base64);
        } else {
          setSelectedImage(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImageInScanner = async (imageBase64: string) => {
    setScannerLoading(true);
    setScanResult(null);
    try {
      const res = await fetch('/api/classify-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error("Scanner error:", err);
    } finally {
      setScannerLoading(false);
    }
  };

  const analyzeTextInScanner = async (itemName: string) => {
    if (!itemName.trim()) return;
    setScannerLoading(true);
    setScanResult(null);
    try {
      const res = await fetch('/api/classify-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: itemName }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error("Scanner error:", err);
    } finally {
      setScannerLoading(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text || "Please inspect this item and provide exact segregation and disposal instructions.",
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setLoading(true);

    try {
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        text: m.content,
        image: m.image,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error: ${res.statusText}`);
      }

      const data = await res.json();
      const modelReply = data.text || "I am ready to help you sort and reduce your waste.";

      let detectedCategory: WasteCategory | undefined;
      for (const cat of CATEGORIES) {
        if (modelReply.toLowerCase().includes(cat.shortName.toLowerCase()) || 
            modelReply.toLowerCase().includes(cat.name.toLowerCase())) {
          detectedCategory = cat.name;
          break;
        }
      }

      const hasWarning = /hazard|danger|caution|fire|explosion|toxic|never flush|poison|severe|laceration|bleach/i.test(modelReply);

      const aiMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: modelReply,
        timestamp: new Date(),
        identifiedCategory: detectedCategory,
        hasSafetyWarning: hasWarning,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Connection issue: ${err.message}. Please check your connection and try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[*#_`~>-]/g, ' ')
      .replace(/\[.*?\]\(.*?\)/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm("Reset conversation history?")) {
      window.speechSynthesis?.cancel();
      setMessages([INITIAL_GREETING]);
      setSpeakingMessageId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Primary Chat Column (7 cols) */}
      <div className="lg:col-span-7 flex flex-col h-[780px] bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Chat Control Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="font-semibold text-sm text-slate-900 tracking-tight">EcoGuide AI Assistant</h2>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-xs text-slate-500">Source Segregation & Safe Handling</span>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/30">
          {messages.map((message) => {
            const isUser = message.role === 'user';

            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Clean Letter Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  {isUser ? 'U' : 'EG'}
                </div>

                <div className="space-y-1.5 max-w-[88%]">
                  <div
                    className={`p-4 rounded-xl text-sm sm:text-base leading-relaxed ${
                      isUser
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {message.image && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 max-w-xs">
                        <img
                          src={message.image}
                          alt="Uploaded waste item"
                          className="w-full h-auto max-h-48 object-cover"
                        />
                      </div>
                    )}

                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div
                        className="prose prose-sm max-w-none text-slate-800 prose-headings:font-semibold prose-headings:text-slate-900 prose-p:leading-relaxed prose-li:my-1"
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(message.content) as string,
                        }}
                      />
                    )}

                    {/* Safety Alert Warning Callout */}
                    {message.hasSafetyWarning && !isUser && (
                      <div className="mt-3 p-3 rounded-lg bg-amber-50/80 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block text-amber-950">Safety Directives:</span>
                          <span>Always wear protective gloves when handling broken glass or corrosive chemicals. Never dump batteries or flush medications down household drains.</span>
                        </div>
                      </div>
                    )}

                    {/* Unboxed Metadata Category Indicator */}
                    {message.identifiedCategory && !isUser && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span>Primary Stream:</span>
                          <strong className="text-slate-900 font-semibold">{message.identifiedCategory}</strong>
                        </div>
                        <button
                          onClick={() => onCategorySelect?.(message.identifiedCategory!)}
                          className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
                        >
                          <span>View Stream Rules</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Message Actions */}
                  {!isUser && (
                    <div className="flex items-center gap-3 pl-1 text-xs text-slate-400">
                      <button
                        onClick={() => handleSpeak(message.content, message.id)}
                        className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
                      >
                        {speakingMessageId === message.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-rose-600">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Read aloud</span>
                          </>
                        )}
                      </button>
                      <span>·</span>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-lg">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                EG
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:0.4s]" />
                </div>
                <span className="text-xs text-slate-500 font-medium">Classifying waste and checking safety rules...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompt Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-slate-50/90 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs text-slate-400 whitespace-nowrap">Suggested:</span>
            {STARTER_PROMPTS.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Upload Thumbnail Indicator */}
        {selectedImage && (
          <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              <span>Image attached for EcoGuide analysis</span>
              <img src={selectedImage} alt="Thumbnail" className="w-6 h-6 object-cover rounded border" />
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-1 hover:bg-emerald-200/50 rounded"
            >
              <X className="w-3.5 h-3.5 text-emerald-900" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleImageSelect(e, false)}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200 shrink-0"
              title="Attach photo of item"
            >
              <Camera className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any item (e.g. 'how to dispose of motor oil?')..."
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-sm placeholder:text-slate-400 bg-slate-50/50"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || (!input.trim() && !selectedImage)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                loading || (!input.trim() && !selectedImage)
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              }`}
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Side Action & Scanner Deck (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Segmented Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
          <button
            onClick={() => setActiveSideTab('scanner')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSideTab === 'scanner'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Waste Scanner
          </button>
          <button
            onClick={() => setActiveSideTab('reference')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSideTab === 'reference'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5 Streams Guide
          </button>
          <button
            onClick={() => setActiveSideTab('safety')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSideTab === 'safety'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Safety Directives
          </button>
        </div>

        {/* Tab 1: AI Waste Scanner */}
        {activeSideTab === 'scanner' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Instant Item Classification</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload a photo or enter any household item to get structured handling rules.
              </p>
            </div>

            {/* Quick Text Inspector Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={quickInspectItem}
                onChange={(e) => setQuickInspectItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && analyzeTextInScanner(quickInspectItem)}
                placeholder="Enter item name (e.g. blister pack, tetra pak)..."
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                onClick={() => analyzeTextInScanner(quickInspectItem)}
                disabled={scannerLoading || !quickInspectItem.trim()}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
              >
                Inspect
              </button>
            </div>

            {/* Drag & Drop Photo Area */}
            <input
              type="file"
              ref={sideScannerInputRef}
              onChange={(e) => handleImageSelect(e, true)}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => sideScannerInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-xl p-5 text-center cursor-pointer transition-colors space-y-1"
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">
                Click or drop a photo of your waste
              </div>
              <div className="text-[11px] text-slate-400">
                Supports packaging, plastics, batteries, bottles, and food scraps
              </div>
            </div>

            {scannerLoading && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-xs font-medium text-slate-600">Analyzing material composition & stream destination...</div>
              </div>
            )}

            {scanResult && !scannerLoading && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{scanResult.identifiedItem}</span>
                    <span className="text-xs font-semibold text-emerald-800">{scanResult.category}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 px-2 py-0.5 bg-white border border-slate-200 rounded">
                    {scanResult.binColor}
                  </span>
                </div>

                {scanResult.isHazardous && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{scanResult.hazardNotes || "Handle with caution."}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700 block">Preparation Checklist:</span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {scanResult.prepSteps.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-800 block mb-0.5">Disposal Method:</strong>
                  <span>{scanResult.properDisposal}</span>
                </div>

                {scanResult.sustainableSwap && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900">
                    <strong className="block text-emerald-950 mb-0.5">Eco Swap:</strong>
                    <span>{scanResult.sustainableSwap}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: 5 Streams Quick Reference */}
        {activeSideTab === 'reference' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-base text-slate-900">The 5 Standard Streams</h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onCategorySelect?.(cat.name)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{cat.shortName}</div>
                    <div className="text-[11px] text-slate-500">{cat.binColor} · {cat.examples.slice(0, 2).join(', ')}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Emergency Safety Directives */}
        {activeSideTab === 'safety' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900">Critical Safety Directives</h3>
            
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
              <strong className="font-semibold text-amber-950 block">1. Lithium-Ion Battery Taping</strong>
              <p className="text-slate-700">
                Always cover contact terminals with clear tape. Punctured batteries ignite inside compaction trucks, generating 1000°C fires.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1">
              <strong className="font-semibold text-rose-950 block">2. Never Flush Pharmaceuticals</strong>
              <p className="text-slate-700">
                Wastewater treatment cannot neutralize synthetic hormones or antibiotics. Always use pharmacy drug take-back boxes.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <strong className="font-semibold text-slate-900 block">3. Broken Glass & Sharps</strong>
              <p className="text-slate-700">
                Wrap shattered mirrors and window panes in thick cardboard, tape securely, and write in large text: "CAUTION: SHARPS".
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export type WasteCategory =
  | 'Wet Waste (Organic / Biodegradable)'
  | 'Dry Waste (Recyclable / Non-Biodegradable)'
  | 'Domestic Hazardous Waste (Chemicals, Paints, Medicines)'
  | 'E-Waste (Electronics, Batteries, Cables)'
  | 'Sanitary / Medical Waste';

export interface CategoryInfo {
  id: string;
  name: WasteCategory;
  shortName: string;
  binColor: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  badgeBg: string;
  iconName: string;
  description: string;
  examples: string[];
  doNotInclude: string[];
  prepGuidelines: string[];
  hazardLevel: 'None' | 'Low' | 'Medium' | 'High' | 'Severe';
  hazardDetails?: string;
}

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  binColor: string;
  prepStep: string;
  disposalAdvice: string;
  isHazardous: boolean;
  hazardNote?: string;
  ecoAlternative?: string;
  recyclingCode?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string;
  timestamp: Date;
  identifiedCategory?: WasteCategory;
  hasSafetyWarning?: boolean;
}

export interface ClassificationResult {
  identifiedItem: string;
  category: WasteCategory;
  binColor: string;
  isRecyclable: boolean;
  isHazardous: boolean;
  hazardNotes?: string;
  prepSteps: string[];
  properDisposal: string;
  sustainableSwap: string;
}

export interface QuizItem {
  id: string;
  item: string;
  correctCategory: WasteCategory;
  hint: string;
  explanation: string;
  hazardAlert?: string;
}

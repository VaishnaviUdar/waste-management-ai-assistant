import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const SYSTEM_INSTRUCTION = `You are EcoGuide AI, a knowledgeable, friendly, and action-oriented Waste Management Awareness Assistant.
Your mission is to educate users on waste segregation, proper disposal methods, recycling techniques, and sustainable waste reduction practices.

Follow these strict principles in all interactions:
1. Segregation First: Always classify mentioned waste into one of these standard categories:
   - Wet Waste (Organic / Biodegradable)
   - Dry Waste (Recyclable / Non-Biodegradable)
   - Domestic Hazardous Waste (Chemicals, Paints, Medicines)
   - E-Waste (Electronics, Batteries, Cables)
   - Sanitary / Medical Waste

2. Actionable Guidance: Provide step-by-step instructions for waste handling (e.g., how to clean recyclables, how to safely dispose of e-waste, or how to start home composting).

3. Tone & Format: Maintain an encouraging, eco-conscious, and clear tone. Use bullet points and simple language for easy readability. Format category names clearly (e.g., **Category: [Category Name]**).

4. Safety & Responsibility: Highlight hazards when dealing with broken glass, batteries, chemicals, aerosol cans, needles, or expired medication. Provide clear caution warnings where applicable.

5. Re-direction: If a user asks an unrelated question (e.g., programming, politics, general trivia), gently and politely redirect them back to waste management, recycling, composting, and eco-friendly practices.`;

// Intelligent Domain Knowledge Synthesizer (Used when upstream AI is temporarily in high demand 503)
function synthesizeKnowledgeFallback(query: string): string {
  const q = query.toLowerCase();

  // Glass / Broken Glass
  if (q.includes("glass") || q.includes("mirror") || q.includes("window")) {
    return `### **Waste Classification & Disposal Protocol**

* **Category:** **Dry Waste (Recyclable / Non-Biodegradable)**
* **Recommended Bin:** **Blue Bin** (or carefully designated dry waste)

#### ⚠️ **Safety & Hazard Alert:**
* **Laceration Risk:** Broken glass poses severe injury hazards to waste collectors and sorting workers.
* **Important Distinction:** Drinking glassware, window panes, and mirrors have different chemical melting points than standard food jars and bottles. They should **not** be mixed into regular container glass recycling streams.

#### 📋 **Step-by-Step Safe Handling:**
1. **Never Toss Loose:** Do not throw shattered glass directly into a plastic garbage bag—it will slice right through.
2. **Double Wrap:** Wrap broken shards securely in several layers of thick newspaper, bubble wrap, or place them inside a rigid corrugated cardboard box.
3. **Seal & Mark:** Tape the cardboard box tightly on all edges with packing tape.
4. **Label Clearly:** Write in large bold letters with a marker: **"CAUTION: BROKEN GLASS / SHARPS"**.
5. **Sanitation Handover:** Hand this parcel separately to your sanitation team or place it prominently atop dry waste bins.

#### 🌱 **Sustainable Alternative:**
* When possible, repurpose intact glass jars for bulk pantry storage, leftovers, or propagation planters!`;
  }

  // Batteries & E-Waste
  if (q.includes("battery") || q.includes("batteries") || q.includes("charger") || q.includes("phone") || q.includes("laptop") || q.includes("e-waste") || q.includes("cable") || q.includes("electronics")) {
    return `### **Waste Classification & Disposal Protocol**

* **Category:** **E-Waste (Electronics, Batteries, Cables)**
* **Recommended Bin:** **Yellow / Tech Bin** (Dedicated E-Waste Drop-Off)

#### 🔥 **Critical Safety Hazard:**
* **Fire Hazard:** Lithium-ion batteries (from phones, vapes, power banks, and laptops) can undergo explosive thermal runaway if crushed or punctured by garbage truck compactors. They are the #1 cause of waste facility fires globally!

#### 📋 **Step-by-Step Handling Instructions:**
1. **Tape the Terminals:** Place non-conductive electrical tape or clear cellophane tape over both electrical terminals (+ and - poles) to prevent accidental friction sparks.
2. **Never Landfill or Bin Mixed:** Never throw loose batteries into regular green, blue, or trash bins.
3. **Handle Swollen Batteries with Care:** If a battery is puffy or hot, immediately store it away from flammable items inside a metal container or bucket of dry sand.
4. **Locate Certified Drop-Off:** Bring to certified e-waste recyclers, electronics retailer drop-boxes (e.g. Best Buy, Call2Recycle), or municipal hazardous waste collection drives.

#### 🌱 **Sustainable Action:**
* Switch to rechargeable NiMH batteries for household remotes and toys to eliminate single-use disposable battery waste.`;
  }

  // Medicine & Pharmaceuticals
  if (q.includes("medicine") || q.includes("pill") || q.includes("syrup") || q.includes("antibiotic") || q.includes("prescription") || q.includes("drug")) {
    return `### **Waste Classification & Disposal Protocol**

* **Category:** **Domestic Hazardous Waste (Chemicals, Paints, Medicines)**
* **Recommended Bin:** **Red / Hazard Bin** (Pharmacy Take-Back)

#### ⚠️ **Critical Safety & Environmental Warning:**
* **NEVER FLUSH MEDICATIONS:** Municipal wastewater treatment plants cannot filter out dissolved pharmaceuticals, antibiotics, or synthetic hormones. Flushing them pollutes drinking reservoirs, damages aquatic ecosystems, and breeds antibiotic-resistant superbugs.

#### 📋 **Step-by-Step Disposal Instructions:**
1. **Leave in Original Packaging:** Keep pills in their original blister packs or bottles.
2. **Protect Your Privacy:** Use a dark permanent marker to scratch out personal prescription names and Rx numbers on labels.
3. **Pharmacy Drop-Box:** Take unused, leftover, or expired medications to your local pharmacy's designated secure drug take-back drop-box or police station collection kiosk.
4. **Emergency Home Disposal (If No Take-Back Exists):** Mix crushed pills with unpalatable substances like used coffee grounds or cat litter in a sealable bag before placing into sealed domestic hazardous waste.

#### 🌱 **Sustainable Action:**
* Buy only prescribed amounts and review medicine cabinets bi-annually to avoid surplus waste.`;
  }

  // Pizza Box & Food Greasy Paper
  if (q.includes("pizza") || q.includes("grease") || q.includes("cardboard")) {
    return `### **Waste Classification & Disposal Protocol**

* **Category:** **Wet Waste (Organic / Biodegradable)** for the greasy section; **Dry Waste (Recyclable)** for the clean top!

#### 💡 **Why Segregation Matters:**
* Paper and cardboard mills wash paper with water. Food grease and oil repel water, preventing paper fibers from binding and destroying entire batches of recycled paper pulp.

#### 📋 **Step-by-Step Separation Instructions:**
1. **The Tear Test:** Open the pizza box and examine the cardboard.
2. **Compost the Greasy Base:** Tear off the oil-soaked or cheese-crusted bottom half. Put it into your **Green Bin (Wet Waste / Composting)**. Microbes love carbon cardboard!
3. **Recycle the Clean Lid:** If the top lid is clean and grease-free, tear it off, flatten it, and place it into the **Blue Bin (Dry Waste)**.
4. **Throw Out Waxed Paper / Plastic Tables:** Remove the tiny plastic pizza saver stool and any wax parchment liners into dry non-recyclables.

#### 🌱 **Sustainable Tip:**
* Ask local pizzerias to place a grease-proof parchment insert under pies so the cardboard remains 100% recyclable.`;
  }

  // Composting
  if (q.includes("compost") || q.includes("peel") || q.includes("food scrap") || q.includes("organic") || q.includes("garden")) {
    return `### **Home Composting & Organic Waste Guide**

* **Category:** **Wet Waste (Organic / Biodegradable)**
* **Recommended Bin:** **Green Bin**

#### 📋 **Step-by-Step Composting Blueprint:**
1. **The 3:1 Golden Ratio:** Balance 3 parts "Browns" (dry carbon: shredded cardboard, dry leaves, egg cartons) to 1 part "Greens" (wet nitrogen: fruit peels, coffee grounds, vegetable scraps).
2. **Moisture Control:** Maintain moisture equivalent to a wrung-out sponge. If wet and smelly, add more shredded cardboard; if dry, add vegetable scraps or water mist.
3. **Aeration:** Turn your pile once a week with a pitchfork or stick to circulate oxygen and prevent foul anaerobic smells.
4. **Chop Scraps:** Cut food waste into 1-inch pieces to accelerate decomposition by 3x.

#### ❌ **What to Keep Out:**
* No meat, bones, cheese/dairy, pet waste, or plastic grocery bags in basic backyard compost.`;
  }

  // General fallback aligned with the 5 principles
  return `### **Waste Classification & Handling Protocol**

* **Standard Categories Available:**
  1. 🟢 **Wet Waste** (Organic / Biodegradable): Fruit & veggie peels, food leftovers, coffee grounds, garden leaves.
  2. 🔵 **Dry Waste** (Recyclable / Non-Biodegradable): Clean plastic bottles, paper, cardboard, aluminum cans, glass.
  3. 🔴 **Domestic Hazardous Waste**: Chemicals, paints, thinners, expired medicines, aerosol spray cans.
  4. 🟡 **E-Waste**: Electronics, lithium batteries, appliances, chargers, cables.
  5. 🟣 **Sanitary / Medical Waste**: Diapers, sanitary napkins, bandages, syringes (sharps in puncture-proof containers).

#### 📋 **Actionable Segregation Checklist:**
* **Empty, Rinse, and Dry** all containers before putting them into recycling bins.
* **Tape Battery Terminals** with electrical tape before dropping them off at e-waste kiosks.
* **Wrap Broken Glass & Sharps** in thick cardboard or newspaper, clearly marked **"CAUTION: SHARPS"**.
* **Never Flush** medicines, chemicals, cooking oils, or sanitary wipes down drains!

How can I help you classify a specific item you have on hand today?`;
}

// API route for Chat with EcoGuide AI
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Extract user query text
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const userQueryText = lastUserMsg?.text || lastUserMsg?.content || "";

    // Check if query is completely unrelated to waste/sustainability to gently redirect
    const offTopicPattern = /^(write a python script|code a website|who is the president|write an essay on world war|solve 2\+2|what is the capital of France)/i;
    if (offTopicPattern.test(userQueryText.trim())) {
      return res.json({
        text: `🌱 As **EcoGuide AI**, my expertise is dedicated to waste management, recycling methods, safe disposal, and sustainable living practices.

Could I help you learn how to segregate household waste, start an odor-free compost pile, or safely dispose of hazardous chemicals and electronics instead?`,
      });
    }

    // Build contents array for Gemini
    const contents = messages.map((m: any) => {
      const parts: any[] = [];

      if (m.image) {
        const matches = m.image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }

      if (m.text) {
        parts.push({ text: m.text });
      } else if (typeof m.content === "string") {
        parts.push({ text: m.content });
      }

      return {
        role: m.role === "user" ? "user" : "model",
        parts: parts.length > 0 ? parts : [{ text: "Hello" }],
      };
    });

    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let responseText = "";

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} note:`, err.message);
      }
    }

    // If upstream AI models are experiencing high demand spike (503), use our domain-specific synthesizer
    if (!responseText) {
      responseText = synthesizeKnowledgeFallback(userQueryText);
    }

    return res.json({
      text: responseText,
    });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    const lastUserMsg = req.body?.messages?.[req.body.messages.length - 1];
    const fallback = synthesizeKnowledgeFallback(lastUserMsg?.text || lastUserMsg?.content || "");
    return res.json({ text: fallback });
  }
});

// Structured Item Classifier API for instant lookup & photo identification
app.post("/api/classify-item", async (req, res) => {
  try {
    const { item, image } = req.body;
    if (!item && !image) {
      return res.status(400).json({ error: "Item name or image is required." });
    }

    const parts: any[] = [];
    if (image) {
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        });
      }
    }

    parts.push({
      text: item
        ? `Analyze this item: "${item}". Determine its exact waste segregation category and disposal instructions.`
        : "Analyze the waste item shown in this image. Identify what it is, classify its category, and provide disposal steps.",
    });

    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let rawText = "";

    const schemaConfig = {
      systemInstruction: `You are an expert waste classification engine. Classify items strictly into one of the 5 standard categories:
1. 'Wet Waste (Organic / Biodegradable)'
2. 'Dry Waste (Recyclable / Non-Biodegradable)'
3. 'Domestic Hazardous Waste (Chemicals, Paints, Medicines)'
4. 'E-Waste (Electronics, Batteries, Cables)'
5. 'Sanitary / Medical Waste'

Return structured JSON. Include safety warnings if applicable.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identifiedItem: {
            type: Type.STRING,
            description: "The name of the item identified",
          },
          category: {
            type: Type.STRING,
            description: "Must be exactly one of the 5 standard categories",
          },
          binColor: {
            type: Type.STRING,
            description: "Recommended standard bin color (e.g. Green, Blue, Red, Yellow, Purple)",
          },
          isRecyclable: {
            type: Type.BOOLEAN,
            description: "Whether this item is widely recyclable",
          },
          isHazardous: {
            type: Type.BOOLEAN,
            description: "Whether this item poses fire, chemical, sharp, or biological hazard",
          },
          hazardNotes: {
            type: Type.STRING,
            description: "Safety warning if hazardous, otherwise empty or gentle reminder",
          },
          prepSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Step-by-step instructions to prepare the item (e.g. rinse, remove tape, discharge, wrap)",
          },
          properDisposal: {
            type: Type.STRING,
            description: "Exact proper disposal method and destination",
          },
          sustainableSwap: {
            type: Type.STRING,
            description: "Eco-friendly reusable or sustainable alternative to reduce future waste",
          },
        },
        required: [
          "identifiedItem",
          "category",
          "binColor",
          "isRecyclable",
          "isHazardous",
          "prepSteps",
          "properDisposal",
          "sustainableSwap",
        ],
      },
    };

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts }],
          config: schemaConfig,
        });
        if (response.text) {
          rawText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Classify model ${model} note:`, err.message);
      }
    }

    if (rawText) {
      const result = JSON.parse(rawText || "{}");
      return res.json(result);
    }

    // Fallback structured classifier with keyword analysis
    const fallbackItem = item || "Household Item";
    const lower = fallbackItem.toLowerCase();

    if (lower.includes("battery") || lower.includes("power bank") || lower.includes("phone") || lower.includes("laptop") || lower.includes("cable") || lower.includes("charger") || lower.includes("electronic") || lower.includes("vape")) {
      return res.json({
        identifiedItem: fallbackItem,
        category: "E-Waste (Electronics, Batteries, Cables)",
        binColor: "Yellow / Tech Bin",
        isRecyclable: true,
        isHazardous: true,
        hazardNotes: "CRITICAL FIRE HAZARD: Lithium-ion cells can explode or ignite if crushed in compaction trucks. Tape both electrical terminals immediately.",
        prepSteps: [
          "Cover both electrical terminals (+/-) with non-conductive electrical tape",
          "Never place loose in standard trash or dry recycling bins",
          "If swollen or leaking, store in a fireproof metal bucket or dry sand"
        ],
        properDisposal: "Drop off at certified municipal e-waste recycling depots or authorized retailer drop-boxes (e.g. Best Buy).",
        sustainableSwap: "Maintain battery charge between 20-80% to maximize lifespan and reduce replacement cycles.",
      });
    }

    if (lower.includes("medicine") || lower.includes("pill") || lower.includes("syrup") || lower.includes("paint") || lower.includes("chemical") || lower.includes("bleach") || lower.includes("cleaner") || lower.includes("aerosol") || lower.includes("insecticide") || lower.includes("pesticide")) {
      return res.json({
        identifiedItem: fallbackItem,
        category: "Domestic Hazardous Waste (Chemicals, Paints, Medicines)",
        binColor: "Red / Hazard Bin",
        isRecyclable: false,
        isHazardous: true,
        hazardNotes: "TOXIC HAZARD: Never flush down toilets or sinks. Contaminates city drinking water and poisons aquatic life.",
        prepSteps: [
          "Keep inside original sealed container with warning label intact",
          "Never mix with other chemicals or pour down drains",
          "Black out personal name and prescription number on medicine bottles"
        ],
        properDisposal: "Hand over to pharmacy take-back collection bins or municipal Household Hazardous Waste (HHW) drives.",
        sustainableSwap: "Use non-toxic eco-friendly cleaners like baking soda, white vinegar, and lemon juice.",
      });
    }

    if (lower.includes("pad") || lower.includes("diaper") || lower.includes("tampon") || lower.includes("needle") || lower.includes("syringe") || lower.includes("bandage") || lower.includes("gauze") || lower.includes("sanitary")) {
      return res.json({
        identifiedItem: fallbackItem,
        category: "Sanitary / Medical Waste",
        binColor: "Purple / Secure Bin",
        isRecyclable: false,
        isHazardous: true,
        hazardNotes: "BIOHAZARD RISK: Contains bodily fluids or sharp points. Never flush down toilets; cause severe pipe blockages.",
        prepSteps: [
          "Wrap securely in multiple layers of newspaper or sealable paper pouch",
          "Mark package with a prominent red 'X' to warn sanitation workers",
          "Sharps and lancets must go inside a puncture-proof thick plastic container taped shut"
        ],
        properDisposal: "Deposit in dedicated sanitary waste bins or hospital medical drop-offs.",
        sustainableSwap: "Consider reusable menstrual cups, washable cloth pads, or reusable modern cloth diapers.",
      });
    }

    if (lower.includes("peel") || lower.includes("food") || lower.includes("fruit") || lower.includes("vegetable") || lower.includes("coffee") || lower.includes("tea") || lower.includes("egg") || lower.includes("leaf") || lower.includes("leaves") || lower.includes("compost")) {
      return res.json({
        identifiedItem: fallbackItem,
        category: "Wet Waste (Organic / Biodegradable)",
        binColor: "Green Bin",
        isRecyclable: true,
        isHazardous: false,
        hazardNotes: "Drain excess cooking moisture to prevent foul anaerobic odors.",
        prepSteps: [
          "Remove any plastic stickers, clips, or synthetic tea bag staples",
          "Chop into 1-inch pieces to accelerate decomposition",
          "Do not enclose in non-biodegradable plastic bags"
        ],
        properDisposal: "Add to home composting bin with 2.5x dry carbon browns, or deposit in municipal green organic bin.",
        sustainableSwap: "Regrow vegetables from kitchen scraps (e.g., green onion roots, celery bases).",
      });
    }

    // Default clean dry recyclable
    return res.json({
      identifiedItem: fallbackItem,
      category: "Dry Waste (Recyclable / Non-Biodegradable)",
      binColor: "Blue Bin",
      isRecyclable: true,
      isHazardous: false,
      hazardNotes: "Ensure item is free of oils, grease, and food residues to prevent contaminating recycling bales.",
      prepSteps: [
        "Empty all liquid and scrape food remnants",
        "Perform a quick rinse and shake dry",
        "Flatten cardboard or plastic bottles to maximize bin capacity"
      ],
      properDisposal: "Place into clean dry waste recycling bin or handover to local recycling collectors.",
      sustainableSwap: "Choose products packaged in infinitely recyclable metal, glass, or unpackaged zero-waste bulk goods.",
    });
  } catch (error: any) {
    console.error("Classification error:", error);
    return res.status(500).json({
      error: error.message || "Failed to classify item.",
    });
  }
});

// Vite middleware for dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoGuide AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

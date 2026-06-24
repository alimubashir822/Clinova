"use client";

import { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Check, 
  Star, 
  Layers, 
  Heart, 
  Smile, 
  User, 
  Scissors, 
  Activity,
  Flame
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  name: string;
  specialty: string;
  price: string;
  rating: number;
  downloads: string;
  description: string;
  fields: string[];
  isHot?: boolean;
}

const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "pack-cardio-advanced",
    name: "Cardiology Angina Scribe Grid",
    specialty: "Cardiology",
    price: "$99/mo",
    rating: 4.9,
    downloads: "240+",
    description: "Advanced cardiac prompt guidelines containing NYHA classification parameters and ECG/Echocardiogram field mappings.",
    fields: ["NYHA Classification", "EKG Rhythm Check", "Ejection Fraction EF%", "Risk Profile & Statin Targets"],
    isHot: true
  },
  {
    id: "pack-peds-asthma",
    name: "Pediatric Asthma Care Set",
    specialty: "Pediatrics",
    price: "$49/mo",
    rating: 4.8,
    downloads: "420+",
    description: "Pediatric asthma action plans, inhalation techniques check, and standardized child developmental trackers.",
    fields: ["Asthma Action Plan Checklist", "Inhaler Spacers Check", "Height & Weight Percentiles", "Family Support Advice"],
  },
  {
    id: "pack-derm-lesion",
    name: "Dermatology Lesion Tracker",
    specialty: "Dermatology",
    price: "$59/mo",
    rating: 4.7,
    downloads: "180+",
    description: "Aesthetic skin scoring parameters, ABCDE lesion criteria, skin phototypes, and sun protective guidelines templates.",
    fields: ["ABCDE Melanoma Checklist", "Fitzpatrick Phototype", "Lesion Dimensions", "SPF Care Guidelines"],
    isHot: true
  },
  {
    id: "pack-dental-restore",
    name: "Dental Oral Hygiene Pack",
    specialty: "Dental",
    price: "$39/mo",
    rating: 4.6,
    downloads: "310+",
    description: "Routine cleaning, pocket depth grids, supragingival calculus metrics, and standard billing procedure sheets.",
    fields: ["Supragingival Calculus Metric", "Pocket Depths Grid (1-6mm)", "Caries Restoration Maps", "Fluoride Rinse Tracker"],
  },
  {
    id: "pack-ortho-joint",
    name: "Orthopedics Joint Bundle",
    specialty: "Orthopedics",
    price: "$79/mo",
    rating: 4.9,
    downloads: "150+",
    description: "Standard joint mobility assessment. Includes ROM (Range of Motion) trackers, gait evaluation, and pain scales.",
    fields: ["Range of Motion (degrees)", "Gait Evaluation Parameters", "Visual Analog Pain Scale", "Exercise Rehabilitation Plan"],
  }
];

export default function MarketplacePage() {
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePurchase = (id: string) => {
    if (purchasedIds.includes(id)) return;
    setPurchasedIds([...purchasedIds, id]);
    alert("Workflow Pack purchased successfully and loaded into your Specialty Templates!");
  };

  const filteredItems = MARKETPLACE_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-accent to-accent bg-clip-text text-transparent">
            AI Documentation Marketplace
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and purchase specialty-specific documentation templates, prompt packages, and clinical workflows.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border/80 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Quota Notice Banner */}
      <div className="bg-gradient-to-br from-accent/15 via-primary/5 to-transparent border border-accent/25 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-24 h-full bg-accent/5 filter blur-2xl"></div>
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent/25 flex items-center justify-center text-accent animate-pulse">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Clinova Premium Workflows</h4>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl leading-relaxed">
              Your organization has <strong>Enterprise Tokens</strong> available. You can download system templates or purchase premium specialty bundles from the listing below.
            </p>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isPurchased = purchasedIds.includes(item.id);

          return (
            <div 
              key={item.id} 
              className={`bg-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition relative ${
                isPurchased ? "border-emerald-500/30 bg-emerald-500/5" : "border-border hover:border-accent/40"
              }`}
            >
              {item.isHot && !isPurchased && (
                <span className="absolute top-4 right-4 bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-orange-500" />
                  Popular
                </span>
              )}
              {isPurchased && (
                <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Purchased
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-accent font-extrabold uppercase tracking-widest block">
                    {item.specialty}
                  </span>
                  <h3 className="font-bold text-base tracking-tight mt-1 text-foreground">
                    {item.name}
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {/* Parameters Preview */}
                <div className="space-y-2 bg-secondary/30 p-4 rounded-xl border border-border/40 text-[11px] leading-relaxed">
                  <span className="font-bold text-foreground block">Included Fields:</span>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {item.fields.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Purchase Box */}
              <div className="pt-4 border-t border-border/40 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Subscription Rate</span>
                  <span className="text-sm font-bold text-foreground">{item.price}</span>
                </div>

                <button
                  onClick={() => handlePurchase(item.id)}
                  disabled={isPurchased}
                  className={`flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl text-xs transition ${
                    isPurchased
                      ? "bg-emerald-500 text-white cursor-default"
                      : "bg-accent hover:bg-accent/90 text-accent-foreground shadow-md shadow-accent/15"
                  }`}
                >
                  {isPurchased ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Active
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Unlock Pack
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const TIME_SLOTS = ["Oggi 15:00-18:00", "Domani Mattina", "Domani Pomeriggio"];

export const TimeSlotPicker = ({ value, onChange, testidPrefix = "slot" }) => (
  <div>
    <div className="flex items-center gap-2 text-sm text-gold mb-2">
      <Clock size={15} />
      <span className="font-medium">Quando preferisci essere contattato dal Responsabile?</span>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {TIME_SLOTS.map((s) => (
        <button key={s} type="button" data-testid={`${testidPrefix}-${s.includes("Oggi") ? "oggi" : s.includes("Mattina") ? "mattina" : "pomeriggio"}`}
          onClick={() => onChange(s)}
          className={cn(
            "px-2 py-2.5 rounded-lg text-xs font-medium border transition-all duration-300",
            value === s
              ? "metallic border-transparent"
              : "border-gold/25 text-gray-300 hover:border-gold/60 bg-night/60"
          )}>
          {s}
        </button>
      ))}
    </div>
  </div>
);

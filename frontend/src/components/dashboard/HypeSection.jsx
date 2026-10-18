import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Rocket, Eye, Share2, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESET_BADGES = [
  "🔥 IL PIÙ VISTO DELLA SETTIMANA",
  "⏳ TRATTATIVA IN CORSO (Affrettati)",
  "💎 ESCLUSIVA SUPREME HOUSE",
  "🔨 ASTA AD ALTO RENDIMENTO (-42%)",
];

export const HypeSection = () => {
  const qc = useQueryClient();
  const { data: props = [] } = useQuery({ queryKey: ["properties"], queryFn: async () => (await api.get("/properties")).data });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["properties"] }); qc.invalidateQueries({ queryKey: ["home"] }); };

  const boost = async (id, body) => { await api.post(`/admin/boost/${id}`, body); refresh(); };
  const [freeVal, setFreeVal] = useState({});

  const globalBoost = async () => {
    const { data } = await api.post("/admin/boost-global");
    toast.success(`Auto-Boost applicato a ${data.boosted} annunci!`);
    refresh();
  };

  const toggleBadge = (p, badge) => {
    const cur = p.status_badges || [];
    const next = cur.includes(badge) ? cur.filter((b) => b !== badge) : [...cur, badge];
    boost(p.id, { status_badges: next });
  };

  return (
    <div data-testid="section-hype">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 text-gold"><Rocket size={20} /><h2 className="font-display text-2xl text-neutral-900">Motore Hype & Boost Visite</h2></div>
        <button data-testid="global-boost-btn" onClick={globalBoost}
          className="flex items-center gap-2 px-5 py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all gold-glow">
          <Zap size={17} /> Auto-Boost Globale Settimanale
        </button>
      </div>

      <div className="space-y-4">
        {props.filter((p) => p.type !== "conclusa").map((p) => (
          <div key={p.id} className="glass-gold rounded-2xl p-5" data-testid={`hype-${p.id}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-gold">{p.ref_code}</div>
                <div className="font-semibold text-neutral-900 truncate">{p.title}</div>
                <div className="flex items-center gap-3 text-sm font-mono mt-1">
                  <span className="flex items-center gap-1 text-gold"><Eye size={13} /> {p.views?.toLocaleString("it-IT")}</span>
                  <span className="flex items-center gap-1 text-emerald"><Share2 size={13} /> {p.whatsapp_shares}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[50, 100, 500].map((n) => (
                  <button key={n} data-testid={`boost-views-${n}-${p.id}`} onClick={() => boost(p.id, { views: n })}
                    className="px-3 py-1.5 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold/10 transition-colors">+{n} Views</button>
                ))}
                <button data-testid={`boost-shares-${p.id}`} onClick={() => boost(p.id, { shares: 5 })}
                  className="px-3 py-1.5 rounded-full border border-emerald/30 text-emerald text-xs hover:bg-emerald/10 transition-colors">+5 Condivisioni</button>
                <div className="flex items-center gap-1">
                  <Input value={freeVal[p.id] || ""} onChange={(e) => setFreeVal({ ...freeVal, [p.id]: e.target.value })}
                    placeholder="n°" className="w-16 h-8 bg-white border-gold/20 text-xs" data-testid={`boost-free-input-${p.id}`} />
                  <button data-testid={`boost-free-${p.id}`} onClick={() => { boost(p.id, { views: Number(freeVal[p.id]) || 0 }); setFreeVal({ ...freeVal, [p.id]: "" }); }}
                    className="px-3 py-1.5 rounded-full metallic text-xs">Applica</button>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <Switch checked={p.observing_now} onCheckedChange={(v) => boost(p.id, { observing_now: v })} data-testid={`observing-${p.id}`} />
                <span className="flex items-center gap-1.5">🔴 In Osservazione Ora</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_BADGES.map((b) => (
                  <button key={b} data-testid={`badge-${p.id}`} onClick={() => toggleBadge(p, b)}
                    className={cn("px-2.5 py-1 rounded-full text-[10px] border transition-all",
                      (p.status_badges || []).includes(b) ? "metallic border-transparent" : "border-black/10 text-neutral-500 hover:border-gold/40")}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

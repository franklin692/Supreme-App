import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Palette, Save, RotateCcw, Type, Square } from "lucide-react";
import { api } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DEFAULT_THEME, FONT_STACK, applyTheme } from "@/components/common/ThemeInjector";

const COLORS = [
  ["color_gold", "Oro / Accento principale"],
  ["color_gold_strong", "Oro forte (titoli)"],
  ["color_ink", "Inchiostro (bottoni scuri)"],
  ["color_bg", "Sfondo del sito"],
  ["color_surface", "Superficie (card)"],
  ["color_text", "Colore del testo"],
  ["color_emerald", "Verde (positivo / live)"],
  ["color_amber", "Ambra (evidenza)"],
];

const DISPLAY_FONTS = ["Sora", "Playfair Display", "Cormorant Garamond", "DM Serif Display", "Poppins", "Montserrat"];
const BODY_FONTS = ["Manrope", "Inter", "Work Sans", "DM Sans", "Nunito Sans", "Poppins"];

const PRESETS = {
  Chiaro: { ...DEFAULT_THEME },
  Notte: { ...DEFAULT_THEME, mode: "dark", color_bg: "#0E0D0A", color_surface: "#17160F", color_text: "#F3EFE4", color_ink: "#F3EFE4", color_gold: "#C9A961", color_gold_strong: "#D8BC7B" },
  Smeraldo: { ...DEFAULT_THEME, color_gold: "#2F8F6B", color_gold_strong: "#1F6E50", color_bg: "#F4F7F4" },
  Notturno_Blu: { ...DEFAULT_THEME, mode: "dark", color_bg: "#0B1020", color_surface: "#121a30", color_text: "#EAF0FF", color_ink: "#EAF0FF", color_gold: "#7FA8FF", color_gold_strong: "#A9C4FF" },
};

export const ThemeSection = () => {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });
  const [t, setT] = useState(DEFAULT_THEME);

  useEffect(() => { if (data?.theme) setT({ ...DEFAULT_THEME, ...data.theme }); }, [data]);

  // Live preview while editing (applies to the whole site instantly)
  useEffect(() => { applyTheme(t); }, [t]);

  const set = (k, v) => setT((p) => ({ ...p, [k]: v }));

  const save = async () => {
    try {
      await api.put("/admin/settings", { theme: t });
      toast.success("Tema salvato e applicato");
      qc.invalidateQueries({ queryKey: ["settings"] });
    } catch { toast.error("Errore nel salvataggio del tema"); }
  };

  const reset = () => { setT({ ...DEFAULT_THEME }); toast.info("Anteprima ripristinata ai valori predefiniti — ricordati di Salvare"); };

  return (
    <div data-testid="section-theme">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-gold"><Palette size={20} /><h2 className="font-display text-2xl text-neutral-900">Aspetto & Tema</h2></div>
        <div className="flex items-center gap-2">
          <button data-testid="theme-reset" onClick={reset} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/10 text-neutral-700 text-sm hover:bg-neutral-100"><RotateCcw size={14} /> Predefiniti</button>
          <button data-testid="theme-save" onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Save size={14} /> Salva tema</button>
        </div>
      </div>

      <p className="text-sm text-neutral-500 mb-5">Modifica colori, font e stile: l'anteprima viene applicata in tempo reale su tutto il sito. Premi <span className="text-gold font-medium">Salva tema</span> per renderla definitiva.</p>

      {/* Quick presets */}
      <div className="glass-gold rounded-2xl p-4 mb-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-400 mb-2">Palette rapide</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([name, preset]) => (
            <button key={name} data-testid={`theme-preset-${name}`} onClick={() => setT({ ...preset })}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-black/10 text-sm hover:border-gold/60 transition-colors">
              <span className="flex -space-x-1">
                <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ background: preset.color_gold }} />
                <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ background: preset.color_bg }} />
                <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ background: preset.color_ink }} />
              </span>
              {name.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          {/* Colors */}
          <div className="glass-gold rounded-2xl p-5">
            <div className="flex items-center gap-2 text-neutral-800 mb-3"><Palette size={16} className="text-gold" /><h3 className="font-display text-lg">Colori</h3></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {COLORS.map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 p-2.5 rounded-xl border border-black/5 bg-white">
                  <input type="color" data-testid={`theme-${key}`} value={t[key]} onChange={(e) => set(key, e.target.value)}
                    className="w-9 h-9 rounded-lg border border-black/10 cursor-pointer bg-transparent p-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-neutral-800 truncate">{label}</div>
                    <div className="text-[11px] font-mono text-neutral-400 uppercase">{t[key]}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Fonts + radius */}
          <div className="glass-gold rounded-2xl p-5">
            <div className="flex items-center gap-2 text-neutral-800 mb-3"><Type size={16} className="text-gold" /><h3 className="font-display text-lg">Font & Stile</h3></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-neutral-500 mb-1 block">Font titoli</label>
                <Select value={t.font_display} onValueChange={(v) => set("font_display", v)}>
                  <SelectTrigger data-testid="theme-font-display" className="bg-white border-black/10"><SelectValue /></SelectTrigger>
                  <SelectContent>{DISPLAY_FONTS.map((f) => <SelectItem key={f} value={f} style={{ fontFamily: FONT_STACK[f] }}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 mb-1 block">Font testo</label>
                <Select value={t.font_body} onValueChange={(v) => set("font_body", v)}>
                  <SelectTrigger data-testid="theme-font-body" className="bg-white border-black/10"><SelectValue /></SelectTrigger>
                  <SelectContent>{BODY_FONTS.map((f) => <SelectItem key={f} value={f} style={{ fontFamily: FONT_STACK[f] }}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] text-neutral-500 mb-1 flex items-center gap-1.5"><Square size={12} /> Raggio angoli card: <span className="font-mono text-gold">{t.radius}px</span></label>
                <input type="range" min="0" max="28" step="1" value={t.radius} data-testid="theme-radius"
                  onChange={(e) => set("radius", Number(e.target.value))} className="w-full accent-[color:var(--sh-gold)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-6 self-start">
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-400 mb-2">Anteprima dal vivo</div>
          <div className="rounded-2xl overflow-hidden border border-black/10" style={{ background: t.color_bg }}>
            <div className="p-5" style={{ background: t.color_surface }}>
              <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: t.color_gold_strong }}>Immobiliare di nuova generazione</div>
              <div className="text-xl font-bold mt-1" style={{ fontFamily: FONT_STACK[t.font_display], color: t.color_text }}>
                Creiamo <span style={{ color: t.color_gold_strong }}>Valore.</span>
              </div>
              <p className="text-xs mt-2" style={{ fontFamily: FONT_STACK[t.font_body], color: t.color_text, opacity: 0.7 }}>
                Hub di servizi immobiliari e property management in tutta la Basilicata.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-2 text-xs font-semibold" style={{ background: t.color_gold, color: t.color_ink, borderRadius: t.radius }}>Prenota Advisor</span>
                <span className="px-3 py-2 text-xs font-semibold text-white" style={{ background: t.color_ink, borderRadius: t.radius }}>Esplora</span>
              </div>
              <div className="flex gap-3 mt-4 text-xs">
                <span style={{ color: t.color_emerald }}>● Live</span>
                <span style={{ color: t.color_amber }}>★ In evidenza</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

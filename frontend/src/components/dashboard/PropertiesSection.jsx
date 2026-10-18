import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit3, Trash2, Building } from "lucide-react";
import { api, formatPrice } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const TYPES = ["vendita", "affitto", "asta", "offmarket", "conclusa"];

const blank = {
  title: "", type: "vendita", sale_type: "vendita", neighborhood: "", city: "Potenza",
  price: 0, old_price: "", discount_pct: "", price_period: "",
  lat: 40.6418, lng: 15.8086, mq: "", rooms: "", bathrooms: "", floor: "", energy_class: "C",
  condo_fee: "", heating: "Termoautonomo", garage: "", elevator: true, rendita_stimata: "",
  advisor_note: "", status_badges: "", photos: "", before_photo: "", after_photo: "", floorplan_photo: "",
  concluded_badge: "", rendimento: "", pre_verified: true,
  distances: { ospedale: "", unibas: "", scale_mobili: "", gallitello: "" },
};

export const PropertiesSection = () => {
  const qc = useQueryClient();
  const { data: props = [] } = useQuery({ queryKey: ["properties"], queryFn: async () => (await api.get("/properties")).data });
  const [editing, setEditing] = useState(null);

  const del = async (id) => {
    await api.delete(`/properties/${id}`);
    toast.success("Immobile eliminato");
    qc.invalidateQueries({ queryKey: ["properties"] });
    qc.invalidateQueries({ queryKey: ["home"] });
  };

  return (
    <div data-testid="section-properties">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gold"><Building size={20} /><h2 className="font-display text-2xl text-neutral-900">Gestione Immobili / Aste / Operazioni</h2></div>
        <button data-testid="prop-new-btn" onClick={() => setEditing(blank)} className="flex items-center gap-2 px-4 py-2.5 rounded-full metallic text-sm font-semibold hover:brightness-110 transition-all"><Plus size={15} /> Nuovo annuncio</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {props.map((p) => (
          <div key={p.id} className="glass-gold rounded-xl p-4" data-testid={`prop-item-${p.id}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-gold">{p.ref_code} · {p.type}</div>
                <div className="font-semibold text-neutral-900 text-sm truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.neighborhood}</div>
                <div className="font-mono text-emerald text-sm mt-1">{formatPrice(p.price, p.price_period)}</div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button data-testid={`prop-edit-${p.id}`} onClick={() => setEditing(p)} className="text-gold hover:scale-110 transition-transform"><Edit3 size={16} /></button>
                <button data-testid={`prop-del-${p.id}`} onClick={() => del(p.id)} className="text-red-400 hover:scale-110 transition-transform"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <PropertyForm initial={editing} onClose={() => setEditing(null)} onDone={() => { qc.invalidateQueries({ queryKey: ["properties"] }); qc.invalidateQueries({ queryKey: ["home"] }); setEditing(null); }} />}
    </div>
  );
};

const PropertyForm = ({ initial, onClose, onDone }) => {
  const isNew = !initial.id;
  const [f, setF] = useState({
    ...blank, ...initial,
    status_badges: Array.isArray(initial.status_badges) ? initial.status_badges.join(" | ") : (initial.status_badges || ""),
    photos: Array.isArray(initial.photos) ? initial.photos.join(", ") : (initial.photos || ""),
    distances: { ...blank.distances, ...(initial.distances || {}) },
    old_price: initial.old_price ?? "", discount_pct: initial.discount_pct ?? "",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setD = (k, v) => setF((p) => ({ ...p, distances: { ...p.distances, [k]: v } }));

  const save = async () => {
    if (!f.title) { toast.error("Inserisci il titolo"); return; }
    const num = (v) => (v === "" || v == null ? null : Number(v));
    const payload = {
      ...f,
      price: num(f.price) || 0,
      old_price: num(f.old_price), discount_pct: num(f.discount_pct),
      lat: num(f.lat), lng: num(f.lng),
      mq: num(f.mq), rooms: num(f.rooms), bathrooms: num(f.bathrooms),
      price_period: f.price_period || null,
      status_badges: f.status_badges ? f.status_badges.split("|").map((s) => s.trim()).filter(Boolean) : [],
      photos: f.photos ? f.photos.split(",").map((s) => s.trim()).filter(Boolean) : [],
      distances: { ospedale: num(f.distances.ospedale), unibas: num(f.distances.unibas), scale_mobili: num(f.distances.scale_mobili), gallitello: num(f.distances.gallitello) },
    };
    try {
      if (isNew) await api.post("/properties", payload);
      else await api.put(`/properties/${initial.id}`, payload);
      toast.success(isNew ? "Annuncio creato" : "Annuncio aggiornato");
      onDone();
    } catch { toast.error("Errore salvataggio"); }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-gold border-gold/30 max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar" data-testid="prop-form-dialog">
        <DialogHeader><DialogTitle className="font-display text-2xl text-gold-gradient">{isNew ? "Nuovo annuncio" : "Modifica annuncio"}</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Titolo" className="sm:col-span-2"><Input data-testid="pf-title" value={f.title} onChange={(e) => set("title", e.target.value)} className={inp} /></Field>
          <Field label="Tipo">
            <Select value={f.type} onValueChange={(v) => set("type", v)}><SelectTrigger data-testid="pf-type" className={inp}><SelectValue /></SelectTrigger>
              <SelectContent className="glass-gold border-gold/30">{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </Field>
          <Field label="Vendita/Affitto (sale_type)">
            <Select value={f.sale_type} onValueChange={(v) => set("sale_type", v)}><SelectTrigger className={inp}><SelectValue /></SelectTrigger>
              <SelectContent className="glass-gold border-gold/30"><SelectItem value="vendita">vendita</SelectItem><SelectItem value="affitto">affitto</SelectItem></SelectContent></Select>
          </Field>
          <Field label="Quartiere"><Input data-testid="pf-neigh" value={f.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} className={inp} /></Field>
          <Field label="Città"><Input value={f.city} onChange={(e) => set("city", e.target.value)} className={inp} /></Field>
          <Field label="Prezzo (€)"><Input data-testid="pf-price" type="number" value={f.price} onChange={(e) => set("price", e.target.value)} className={inp} /></Field>
          <Field label="Periodo (es. mese, vuoto=vendita)"><Input value={f.price_period} onChange={(e) => set("price_period", e.target.value)} className={inp} /></Field>
          <Field label="Prezzo precedente (barrato)"><Input type="number" value={f.old_price} onChange={(e) => set("old_price", e.target.value)} className={inp} /></Field>
          <Field label="Ribasso % (es. -9.6)"><Input type="number" value={f.discount_pct} onChange={(e) => set("discount_pct", e.target.value)} className={inp} /></Field>
          <Field label="Lat"><Input value={f.lat} onChange={(e) => set("lat", e.target.value)} className={inp} /></Field>
          <Field label="Lng"><Input value={f.lng} onChange={(e) => set("lng", e.target.value)} className={inp} /></Field>
          <Field label="Mq"><Input value={f.mq} onChange={(e) => set("mq", e.target.value)} className={inp} /></Field>
          <Field label="Locali"><Input value={f.rooms} onChange={(e) => set("rooms", e.target.value)} className={inp} /></Field>
          <Field label="Bagni"><Input value={f.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={inp} /></Field>
          <Field label="Piano"><Input value={f.floor} onChange={(e) => set("floor", e.target.value)} className={inp} /></Field>
          <Field label="Classe energetica"><Input value={f.energy_class} onChange={(e) => set("energy_class", e.target.value)} className={inp} /></Field>
          <Field label="Condominio"><Input value={f.condo_fee} onChange={(e) => set("condo_fee", e.target.value)} className={inp} /></Field>
          <Field label="Riscaldamento"><Input value={f.heating} onChange={(e) => set("heating", e.target.value)} className={inp} /></Field>
          <Field label="Garage"><Input value={f.garage} onChange={(e) => set("garage", e.target.value)} className={inp} /></Field>
          <Field label="Rendita stimata" className="sm:col-span-2"><Input value={f.rendita_stimata} onChange={(e) => set("rendita_stimata", e.target.value)} className={inp} /></Field>
          <div className="sm:col-span-2 grid grid-cols-4 gap-2">
            <Field label="Min Ospedale"><Input value={f.distances.ospedale} onChange={(e) => setD("ospedale", e.target.value)} className={inp} /></Field>
            <Field label="Min UNIBAS"><Input value={f.distances.unibas} onChange={(e) => setD("unibas", e.target.value)} className={inp} /></Field>
            <Field label="M Scale Mobili"><Input value={f.distances.scale_mobili} onChange={(e) => setD("scale_mobili", e.target.value)} className={inp} /></Field>
            <Field label="Min Gallitello"><Input value={f.distances.gallitello} onChange={(e) => setD("gallitello", e.target.value)} className={inp} /></Field>
          </div>
          <Field label="Foto (URL separati da virgola)" className="sm:col-span-2"><Textarea data-testid="pf-photos" value={f.photos} onChange={(e) => set("photos", e.target.value)} className={inp + " min-h-[52px]"} /></Field>
          <Field label="Foto STATO ATTUALE (before)"><Input value={f.before_photo} onChange={(e) => set("before_photo", e.target.value)} className={inp} /></Field>
          <Field label="Foto RISTRUTTURATO (after)"><Input value={f.after_photo} onChange={(e) => set("after_photo", e.target.value)} className={inp} /></Field>
          <Field label="Planimetria (URL da sfocare)" className="sm:col-span-2"><Input value={f.floorplan_photo} onChange={(e) => set("floorplan_photo", e.target.value)} className={inp} /></Field>
          <Field label="Bollini Status (separati da |)" className="sm:col-span-2"><Input data-testid="pf-badges" value={f.status_badges} onChange={(e) => set("status_badges", e.target.value)} className={inp} placeholder="🔥 IL PIÙ VISTO | 💎 ESCLUSIVA" /></Field>
          <Field label="Bollino Operazione Conclusa"><Input value={f.concluded_badge} onChange={(e) => set("concluded_badge", e.target.value)} className={inp} placeholder="✔️ VENDUTO IN 18 GIORNI" /></Field>
          <Field label="Rendimento (off-market)"><Input value={f.rendimento} onChange={(e) => set("rendimento", e.target.value)} className={inp} /></Field>
          <Field label="Nota dell'Advisor" className="sm:col-span-2"><Textarea data-testid="pf-note" value={f.advisor_note} onChange={(e) => set("advisor_note", e.target.value)} className={inp + " min-h-[70px]"} /></Field>
          <div className="flex items-center gap-2"><Switch checked={f.pre_verified} onCheckedChange={(v) => set("pre_verified", v)} data-testid="pf-verified" /><span className="text-sm text-neutral-600">Scudo Pre-Verificato</span></div>
          <div className="flex items-center gap-2"><Switch checked={f.elevator} onCheckedChange={(v) => set("elevator", v)} /><span className="text-sm text-neutral-600">Ascensore</span></div>
        </div>
        <button onClick={save} data-testid="pf-save" className="w-full py-3 mt-2 rounded-full metallic font-semibold hover:brightness-110 transition-all">{isNew ? "Crea annuncio" : "Salva modifiche"}</button>
      </DialogContent>
    </Dialog>
  );
};

const inp = "bg-white border-gold/20 focus-visible:ring-gold text-sm h-9";
const Field = ({ label, children, className = "" }) => (
  <div className={className}><label className="text-[11px] text-muted-foreground mb-1 block">{label}</label>{children}</div>
);

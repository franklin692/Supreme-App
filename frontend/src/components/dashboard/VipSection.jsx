import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Crown, Copy, Trash2, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const VipSection = () => {
  const qc = useQueryClient();
  const { data: links = [] } = useQuery({ queryKey: ["vip-links"], queryFn: async () => (await api.get("/admin/vip-links")).data });
  const [f, setF] = useState({ owner_name: "", neighborhood: "", compatible_buyers: 7 });

  const create = async () => {
    if (!f.owner_name) { toast.error("Inserisci il nome del proprietario"); return; }
    await api.post("/admin/vip-links", f);
    toast.success("Link riservato generato");
    setF({ owner_name: "", neighborhood: "", compatible_buyers: 7 });
    qc.invalidateQueries({ queryKey: ["vip-links"] });
  };
  const del = async (id) => { await api.delete(`/admin/vip-links/${id}`); qc.invalidateQueries({ queryKey: ["vip-links"] }); };

  const fullUrl = (token) => `${window.location.origin}/vip/${token}`;
  const copy = (token) => { navigator.clipboard.writeText(fullUrl(token)); toast.success("Link copiato negli appunti"); };

  return (
    <div data-testid="section-vip">
      <div className="flex items-center gap-2 text-gold mb-5"><Crown size={20} /><h2 className="font-display text-2xl text-neutral-900">Generatore Link Riservato per Proprietario VIP</h2></div>

      <div className="glass-gold rounded-2xl p-5 mb-6 grid sm:grid-cols-4 gap-3 items-end">
        <div><label className="text-[11px] text-muted-foreground mb-1 block">Nome proprietario</label><Input data-testid="vip-owner" placeholder="Es. Dott. Mancusi" value={f.owner_name} onChange={(e) => setF({ ...f, owner_name: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" /></div>
        <div><label className="text-[11px] text-muted-foreground mb-1 block">Quartiere immobile</label><Input data-testid="vip-neigh" placeholder="Es. Macchia Romana" value={f.neighborhood} onChange={(e) => setF({ ...f, neighborhood: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" /></div>
        <div><label className="text-[11px] text-muted-foreground mb-1 block">Acquirenti compatibili</label><Input data-testid="vip-buyers" type="number" value={f.compatible_buyers} onChange={(e) => setF({ ...f, compatible_buyers: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" /></div>
        <button data-testid="vip-create" onClick={create} className="py-2.5 rounded-full metallic font-semibold hover:brightness-110 transition-all">Genera Link</button>
      </div>

      <div className="space-y-3">
        {links.map((l) => (
          <div key={l.id} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" data-testid={`vip-link-${l.id}`}>
            <div>
              <div className="font-semibold text-neutral-900">{l.owner_name} <span className="text-muted-foreground font-normal text-sm">· {l.neighborhood} · {l.compatible_buyers} acquirenti</span></div>
              <div className="text-xs font-mono text-gold break-all">{fullUrl(l.token)}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button data-testid={`vip-copy-${l.id}`} onClick={() => copy(l.token)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold/10"><Copy size={13} /> Copia</button>
              <a href={fullUrl(l.token)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/30 text-gold text-xs hover:bg-gold/10"><ExternalLink size={13} /> Apri</a>
              <button onClick={() => del(l.id)} className="text-red-400"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {links.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">Nessun link generato. Crea il primo dossier riservato.</div>}
      </div>
    </div>
  );
};

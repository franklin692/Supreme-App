import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Phone, Search, Database, Edit3 } from "lucide-react";
import { api, waLink } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const STATUS = ["nuovo", "in_lavorazione", "contattato", "chiuso"];

export const LeadsSection = () => {
  const qc = useQueryClient();
  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: async () => (await api.get("/leads")).data });
  const [q, setQ] = useState("");
  const [typeF, setTypeF] = useState("tutti");
  const [editing, setEditing] = useState(null);

  const types = useMemo(() => ["tutti", ...Array.from(new Set(leads.map((l) => l.request_type)))], [leads]);
  const filtered = leads.filter((l) =>
    (typeF === "tutti" || l.request_type === typeF) &&
    (!q || (l.name || "").toLowerCase().includes(q.toLowerCase()) || (l.phone || "").includes(q)));

  return (
    <div data-testid="section-leads">
      <div className="flex items-center gap-2 text-gold mb-5"><Database size={20} /><h2 className="font-display text-2xl text-white">Archivio Clienti & Lead — Banca Dati Unificata</h2></div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input data-testid="leads-search" placeholder="Cerca per nome o telefono" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 bg-night/70 border-gold/20 focus-visible:ring-gold" />
        </div>
        <Select value={typeF} onValueChange={setTypeF}>
          <SelectTrigger data-testid="leads-filter-type" className="sm:w-72 bg-night/70 border-gold/20"><SelectValue /></SelectTrigger>
          <SelectContent className="glass-gold border-gold/30 max-h-72">
            {types.map((t) => <SelectItem key={t} value={t}>{t === "tutti" ? "Tutti i tipi di richiesta" : t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/10">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Telefono</th>
                <th className="px-4 py-3">Tipo richiesta</th>
                <th className="px-4 py-3">Interesse</th>
                <th className="px-4 py-3">Fascia</th>
                <th className="px-4 py-3">Stato</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.02]" data-testid={`lead-row-${l.id}`}>
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{l.name}</td>
                  <td className="px-4 py-3">
                    <a href={waLink(l.phone)} target="_blank" rel="noreferrer" data-testid={`lead-wa-${l.id}`}
                      className="inline-flex items-center gap-1.5 text-emerald hover:underline"><Phone size={13} /> {l.phone}</a>
                  </td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{l.request_type}</td>
                  <td className="px-4 py-3 text-gold text-xs">{l.property_title || l.service || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{l.time_slot || "—"}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">{l.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button data-testid={`lead-edit-${l.id}`} onClick={() => setEditing(l)} className="text-gold hover:scale-110 transition-transform"><Edit3 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-muted-foreground text-sm">Nessun lead trovato.</div>}
      </div>
      <div className="text-xs text-muted-foreground mt-3">{filtered.length} lead · Tutti i moduli del sito confluiscono qui.</div>

      {editing && <EditLeadDialog lead={editing} onClose={() => setEditing(null)} onDone={() => { qc.invalidateQueries({ queryKey: ["leads"] }); setEditing(null); }} />}
    </div>
  );
};

const EditLeadDialog = ({ lead, onClose, onDone }) => {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.agent_notes || "");
  const save = async () => {
    await api.put(`/leads/${lead.id}`, { status, agent_notes: notes });
    toast.success("Lead aggiornato");
    onDone();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-gold border-gold/30 max-w-md" data-testid="lead-edit-dialog">
        <DialogHeader><DialogTitle className="font-display text-xl text-gold-gradient">{lead.name}</DialogTitle></DialogHeader>
        <div className="text-sm text-muted-foreground -mt-2">{lead.request_type} · {lead.phone}</div>
        <div className="space-y-3 mt-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger data-testid="lead-edit-status" className="bg-night/70 border-gold/20"><SelectValue /></SelectTrigger>
            <SelectContent className="glass-gold border-gold/30">{STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Textarea data-testid="lead-edit-notes" placeholder="Note agente" value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-night/70 border-gold/20 focus-visible:ring-gold min-h-[90px]" />
          <button onClick={save} data-testid="lead-edit-save" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all">Salva</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

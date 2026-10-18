import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Phone, Plus, CalendarDays } from "lucide-react";
import { api, waLink } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIME_SLOTS } from "@/components/common/TimeSlotPicker";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS = { da_chiamare: { label: "Da chiamare", c: "text-amber" }, fissato: { label: "Fissato", c: "text-emerald" }, concluso: { label: "Concluso", c: "text-muted-foreground" } };

export const AgendaSection = () => {
  const qc = useQueryClient();
  const { data: appts = [] } = useQuery({ queryKey: ["appointments"], queryFn: async () => (await api.get("/appointments")).data });
  const [open, setOpen] = useState(false);

  const setStatus = async (id, status) => {
    await api.put(`/appointments/${id}`, { status });
    qc.invalidateQueries({ queryKey: ["appointments"] });
  };

  const bySlot = TIME_SLOTS.map((slot) => ({ slot, items: appts.filter((a) => a.time_slot === slot) }));
  const others = appts.filter((a) => !TIME_SLOTS.includes(a.time_slot));

  return (
    <div data-testid="section-agenda">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gold"><CalendarDays size={20} /><h2 className="font-display text-2xl text-white">Calendario Giornaliero & Agenda</h2></div>
        <AddAppointmentDialog open={open} setOpen={setOpen} onDone={() => qc.invalidateQueries({ queryKey: ["appointments"] })} />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {bySlot.map(({ slot, items }) => (
          <div key={slot} className="glass rounded-2xl p-4">
            <div className="text-sm font-semibold text-gold mb-3 pb-2 border-b border-white/5">{slot} <span className="text-muted-foreground font-normal">({items.length})</span></div>
            <div className="space-y-3">
              {items.length === 0 && <div className="text-xs text-muted-foreground py-4 text-center">Nessun appuntamento</div>}
              {items.map((a) => <ApptCard key={a.id} a={a} setStatus={setStatus} />)}
            </div>
          </div>
        ))}
      </div>

      {others.length > 0 && (
        <div className="mt-5 glass rounded-2xl p-4">
          <div className="text-sm font-semibold text-gold mb-3">Altri appuntamenti</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {others.map((a) => <ApptCard key={a.id} a={a} setStatus={setStatus} />)}
          </div>
        </div>
      )}
    </div>
  );
};

const ApptCard = ({ a, setStatus }) => (
  <div className="glass-gold rounded-xl p-3" data-testid={`appt-${a.id}`}>
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-white">{a.client_name}</span>
      <a href={waLink(a.phone)} target="_blank" rel="noreferrer" className="text-emerald hover:scale-110 transition-transform"><Phone size={15} /></a>
    </div>
    <div className="text-xs text-muted-foreground mt-0.5">{a.type}</div>
    {a.property_title && <div className="text-[11px] text-gold mt-0.5">{a.property_title}</div>}
    <div className="text-[11px] text-muted-foreground mt-1">{a.date}</div>
    <Select value={a.status} onValueChange={(v) => setStatus(a.id, v)}>
      <SelectTrigger className={cn("mt-2 h-8 text-xs bg-night/70 border-gold/20", STATUS[a.status]?.c)} data-testid={`appt-status-${a.id}`}>
        <SelectValue>{STATUS[a.status]?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="glass-gold border-gold/30">
        {Object.entries(STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

const AddAppointmentDialog = ({ open, setOpen, onDone }) => {
  const [f, setF] = useState({ client_name: "", phone: "", type: "Sopralluogo", time_slot: TIME_SLOTS[0], status: "fissato", notes: "" });
  const save = async () => {
    if (!f.client_name) { toast.error("Inserisci il nome cliente"); return; }
    await api.post("/appointments", f);
    toast.success("Appuntamento aggiunto");
    setOpen(false); onDone();
    setF({ client_name: "", phone: "", type: "Sopralluogo", time_slot: TIME_SLOTS[0], status: "fissato", notes: "" });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button data-testid="add-appt-btn" onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full metallic text-sm font-semibold hover:brightness-110 transition-all"><Plus size={15} /> Nuovo appuntamento</button>
      <DialogContent className="glass-gold border-gold/30 max-w-md" data-testid="add-appt-dialog">
        <DialogHeader><DialogTitle className="font-display text-xl text-gold-gradient">Nuovo appuntamento</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input data-testid="appt-name" placeholder="Nome cliente" value={f.client_name} onChange={(e) => setF({ ...f, client_name: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
          <Input data-testid="appt-phone" placeholder="Telefono" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
          <Input placeholder="Tipo (es. Sopralluogo)" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
          <Select value={f.time_slot} onValueChange={(v) => setF({ ...f, time_slot: v })}>
            <SelectTrigger className="bg-night/70 border-gold/20"><SelectValue /></SelectTrigger>
            <SelectContent className="glass-gold border-gold/30">{TIME_SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <button onClick={save} data-testid="appt-save" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all">Aggiungi all'agenda</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

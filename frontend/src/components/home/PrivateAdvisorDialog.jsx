import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TimeSlotPicker } from "@/components/common/TimeSlotPicker";
import { Home, Video, Handshake, CheckCircle2, Check } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "sopralluogo", icon: Home, title: "Sopralluogo Diretto a Domicilio", tag: "Consigliato",
    desc: "Un nostro responsabile di zona viene direttamente presso il tuo immobile." },
  { id: "videodesk", icon: Video, title: "Video-Desk Direzionale (15 min)", tag: null,
    desc: "Analisi immediata in videochiamata con condivisione schermo di dati e perizie." },
  { id: "studio", icon: Handshake, title: "Incontro presso Studio Tecnico/Notarile Partner", tag: null,
    desc: "Su appuntamento riservato per firma incarichi e verifiche urbanistiche." },
];

export const PrivateAdvisorDialog = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [sel, setSel] = useState("sopralluogo");
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.phone) { toast.error("Inserisci Nome e WhatsApp"); return; }
    const opt = OPTIONS.find((o) => o.id === sel);
    setLoading(true);
    try {
      await api.post("/leads", {
        name: form.name, phone: form.phone,
        request_type: "Prenotazione Private Advisor",
        time_slot: slot || null,
        notes: `Modalità scelta: ${opt.title}`,
      });
      setDone(true);
    } catch { toast.error("Errore. Riprova."); }
    finally { setLoading(false); }
  };

  const reset = () => { setDone(false); setSel("sopralluogo"); setSlot(""); setForm({ name: "", phone: "" }); };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(reset, 200); }}>
      <div onClick={() => setOpen(true)} className="contents">{trigger}</div>
      <DialogContent className="glass-gold border-gold/30 max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar" data-testid="advisor-dialog">
        {!done ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-gold-gradient">Prenota un Private Advisor</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground -mt-2">Scegli come vuoi essere seguito. Nessun ufficio da raggiungere: siamo noi a venire da te.</p>
            <div className="space-y-2.5 mt-2">
              {OPTIONS.map((o) => {
                const Icon = o.icon;
                const active = sel === o.id;
                return (
                  <button key={o.id} type="button" data-testid={`advisor-opt-${o.id}`} onClick={() => setSel(o.id)}
                    className={cn("w-full text-left p-4 rounded-xl border transition-all duration-300 flex gap-3",
                      active ? "border-gold bg-gold/10" : "border-black/10 hover:border-gold/40 bg-neutral-50")}>
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", active ? "metallic" : "bg-neutral-100 border border-gold/20 text-gold")}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 text-sm">{o.title}</span>
                        {o.tag && <span className="text-[10px] metallic px-2 py-0.5 rounded-full">{o.tag}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{o.desc}</p>
                    </div>
                    {active && <Check size={18} className="text-gold shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="space-y-3 mt-3">
              <Input data-testid="advisor-name" placeholder="Nome e Cognome" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" />
              <Input data-testid="advisor-phone" placeholder="Numero WhatsApp" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" />
              <TimeSlotPicker value={slot} onChange={setSlot} testidPrefix="advisor-slot" />
              <button onClick={submit} disabled={loading} data-testid="advisor-submit"
                className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 disabled:opacity-60">
                {loading ? "Invio..." : "Conferma Prenotazione VIP"}
              </button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center" data-testid="advisor-success">
            <CheckCircle2 size={56} className="text-emerald mx-auto mb-4" />
            <h3 className="font-display text-2xl text-gold-gradient mb-2">Prenotazione ricevuta</h3>
            <p className="text-neutral-600 text-sm px-4">Un Private Advisor Supreme House ti contatterà nella fascia oraria scelta.</p>
            <button onClick={() => setOpen(false)} className="mt-6 px-6 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300">Chiudi</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

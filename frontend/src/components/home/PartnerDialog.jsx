import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  "Agenzia Immobiliare", "Geometra", "Architetto/Ingegnere", "Notaio/Avvocato",
  "Impresa Edile", "Consulente Creditizio", "Ditta Sgomberi/Allestimenti",
];

export const PartnerDialog = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", category: "", email: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.category) { toast.error("Compila nome, WhatsApp e categoria"); return; }
    setLoading(true);
    try {
      await api.post("/leads", {
        name: form.name, phone: form.phone, email: form.email || null,
        request_type: "Accreditamento Partner",
        service: form.category,
        notes: `Categoria partner: ${form.category}`,
      });
      setDone(true);
    } catch { toast.error("Errore. Riprova."); }
    finally { setLoading(false); }
  };

  const reset = () => { setDone(false); setForm({ name: "", phone: "", category: "", email: "" }); };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(reset, 200); }}>
      <div onClick={() => setOpen(true)} className="contents">{trigger}</div>
      <DialogContent className="glass-gold border-gold/30 max-w-md" data-testid="partner-dialog">
        {!done ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-gold-gradient">Accreditamento Partner</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-3 mt-1">
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger data-testid="partner-category" className="bg-night/70 border-gold/20 focus:ring-gold">
                  <SelectValue placeholder="Seleziona la tua categoria" />
                </SelectTrigger>
                <SelectContent className="glass-gold border-gold/30">
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c} data-testid={`partner-cat-${c}`}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input data-testid="partner-name" placeholder="Nome / Ragione Sociale" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
              <Input data-testid="partner-phone" placeholder="Numero WhatsApp" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
              <Input data-testid="partner-email" placeholder="Email (facoltativa)" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
              <button type="submit" disabled={loading} data-testid="partner-submit"
                className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 disabled:opacity-60">
                {loading ? "Invio..." : "Invia richiesta di partnership"}
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center" data-testid="partner-success">
            <CheckCircle2 size={56} className="text-emerald mx-auto mb-4" />
            <h3 className="font-display text-2xl text-gold-gradient mb-2">Richiesta inviata</h3>
            <p className="text-gray-300 text-sm px-4">Valuteremo il tuo profilo e ti ricontatteremo per l'accreditamento alla rete Partner.</p>
            <button onClick={() => setOpen(false)} className="mt-6 px-6 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300">Chiudi</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

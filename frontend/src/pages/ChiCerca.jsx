import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { SectionTitle } from "@/components/common/Primitives";
import { BuyerRequestCard } from "@/components/common/BuyerRequestCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export default function ChiCerca() {
  const { data: requests = [] } = useQuery({ queryKey: ["buyer-requests"], queryFn: async () => (await api.get("/buyer-requests")).data });

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 lg:py-14">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
        <SectionTitle eyebrow="Borsa Acquirenti · Mercato Rovesciato" title="Richieste Attive & Investitori in Attesa"
          subtitle="Clienti verificati pronti all'acquisto o alla locazione. Qui sono gli immobili a cercare i proprietari."
          className="mb-0" />
        <InsertRequestDialog />
      </div>

      <div className="glass-gold rounded-2xl p-5 mb-8 flex items-center gap-3">
        <TrendingUp className="text-emerald" size={22} />
        <p className="text-sm text-neutral-700">
          <span className="font-semibold text-emerald">{requests.length} richieste verificate</span> attive in questo momento.
          Hai un immobile adatto? Proponilo direttamente al cliente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((r, i) => <BuyerRequestCard key={r.id} request={r} testId={`cc-req-${i}`} />)}
      </div>
    </div>
  );
}

const InsertRequestDialog = () => {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", profile: "", searching: "", zone: "", budget: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name || !f.phone || !f.searching) { toast.error("Compila almeno Nome, WhatsApp e cosa cerchi"); return; }
    setLoading(true);
    try {
      await api.post("/buyer-requests/public", {
        name: f.name, phone: f.phone,
        profile: f.profile || "Acquirente/Inquilino",
        searching: f.searching, zone: f.zone || "Potenza", budget: f.budget || "Da definire",
      });
      setDone(true);
    } catch { toast.error("Errore. Riprova."); }
    finally { setLoading(false); }
  };

  const reset = () => { setDone(false); setF({ name: "", phone: "", profile: "", searching: "", zone: "", budget: "" }); };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(reset, 200); }}>
      <button data-testid="insert-request-btn" onClick={() => setOpen(true)}
        className="px-6 py-3.5 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap gold-glow">
        <Plus size={18} /> Inserisci la tua Richiesta di Ricerca
      </button>
      <DialogContent className="glass-gold border-gold/30 max-w-md max-h-[90vh] overflow-y-auto no-scrollbar" data-testid="insert-request-dialog">
        {!done ? (
          <>
            <DialogHeader><DialogTitle className="font-display text-2xl text-gold-gradient">La tua Richiesta di Ricerca</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground -mt-2">La richiesta verrà verificata e pubblicata nella Borsa Acquirenti.</p>
            <form onSubmit={submit} className="space-y-3 mt-2">
              <Input data-testid="ir-name" placeholder="Nome e Cognome" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" />
              <Input data-testid="ir-phone" placeholder="Numero WhatsApp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" />
              <Input data-testid="ir-profile" placeholder="Il tuo profilo (es. Giovane coppia, Investitore)" value={f.profile} onChange={(e) => setF({ ...f, profile: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" />
              <Textarea data-testid="ir-searching" placeholder="Cosa cerchi? (es. Trilocale in affitto)" value={f.searching} onChange={(e) => setF({ ...f, searching: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold min-h-[60px]" />
              <Input data-testid="ir-zone" placeholder="Zona / Quartiere" value={f.zone} onChange={(e) => setF({ ...f, zone: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" />
              <Input data-testid="ir-budget" placeholder="Budget (es. Fino a 160.000€)" value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })} className="bg-white border-gold/20 focus-visible:ring-gold" />
              <button type="submit" disabled={loading} data-testid="ir-submit" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 disabled:opacity-60">
                {loading ? "Invio..." : "Invia Richiesta"}
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center" data-testid="ir-success">
            <CheckCircle2 size={56} className="text-emerald mx-auto mb-4" />
            <h3 className="font-display text-2xl text-gold-gradient mb-2">Richiesta inviata</h3>
            <p className="text-neutral-600 text-sm px-4">La tua richiesta è in fase di verifica. Una volta approvata sarà visibile ai proprietari.</p>
            <button onClick={() => setOpen(false)} className="mt-6 px-6 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300">Chiudi</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

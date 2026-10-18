import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimeSlotPicker } from "@/components/common/TimeSlotPicker";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export const LeadDialog = ({
  trigger,
  title = "Lascia i tuoi dati",
  description = "",
  requestType,
  property = null,
  service = null,
  showTimeSlot = true,
  showEmail = false,
  successMessage = "Richiesta inviata! Un Responsabile ti contatterà a breve.",
  onSuccess,
  testId = "lead",
}) => {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", time_slot: "", notes: "" });

  const reset = () => { setForm({ name: "", phone: "", email: "", time_slot: "", notes: "" }); setDone(false); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error("Inserisci Nome e Numero WhatsApp"); return; }
    setLoading(true);
    try {
      await api.post("/leads", {
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        request_type: requestType,
        property_ref: property?.ref_code || null,
        property_title: property?.title || null,
        service: service || null,
        time_slot: showTimeSlot ? form.time_slot || null : null,
        notes: form.notes || null,
      });
      setDone(true);
      onSuccess && onSuccess();
    } catch {
      toast.error("Errore di invio. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(reset, 200); }}>
      <div onClick={() => setOpen(true)} className="contents">{trigger}</div>
      <DialogContent className="glass-gold border-gold/30 max-w-md" data-testid={`${testId}-dialog`}>
        {!done ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-gold-gradient">{title}</DialogTitle>
              {description && <DialogDescription className="text-neutral-600 leading-relaxed">{description}</DialogDescription>}
            </DialogHeader>
            {property && (
              <div className="text-xs font-mono text-gold bg-gold/10 rounded-md px-3 py-2 border border-gold/20">
                Immobile: {property.ref_code} · {property.title}
              </div>
            )}
            <form onSubmit={submit} className="space-y-3 mt-1">
              <Input data-testid={`${testId}-name`} placeholder="Nome e Cognome" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-white border-gold/20 focus-visible:ring-gold" />
              <Input data-testid={`${testId}-phone`} placeholder="Numero WhatsApp" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-white border-gold/20 focus-visible:ring-gold" />
              {showEmail && (
                <Input data-testid={`${testId}-email`} placeholder="Email (facoltativa)" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-white border-gold/20 focus-visible:ring-gold" />
              )}
              {showTimeSlot && (
                <TimeSlotPicker value={form.time_slot} onChange={(v) => setForm({ ...form, time_slot: v })} testidPrefix={`${testId}-slot`} />
              )}
              <Textarea data-testid={`${testId}-notes`} placeholder="Note (facoltative)" value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="bg-white border-gold/20 focus-visible:ring-gold min-h-[64px]" />
              <button type="submit" disabled={loading} data-testid={`${testId}-submit`}
                className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 disabled:opacity-60">
                {loading ? "Invio..." : "Invia Richiesta Riservata"}
              </button>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground justify-center">
                <ShieldCheck size={13} className="text-emerald" /> Dati trattati con la massima riservatezza
              </p>
            </form>
          </>
        ) : (
          <div className="py-8 text-center" data-testid={`${testId}-success`}>
            <CheckCircle2 size={56} className="text-emerald mx-auto mb-4" />
            <h3 className="font-display text-2xl text-gold-gradient mb-2">Perfetto!</h3>
            <p className="text-neutral-600 text-sm leading-relaxed px-4">{successMessage}</p>
            <button onClick={() => setOpen(false)} className="mt-6 px-6 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300">
              Chiudi
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

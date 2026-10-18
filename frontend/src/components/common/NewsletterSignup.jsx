import React, { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Mail, Check } from "lucide-react";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) { toast.error("Inserisci un'email valida"); return; }
    try {
      await api.post("/newsletter", { email });
      setDone(true);
      toast.success("Iscrizione completata!");
    } catch {
      toast.error("Errore iscrizione");
    }
  };

  return (
    <div className="glass-gold rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5" data-testid="newsletter-signup">
      <div>
        <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.25em] mb-2"><Mail size={14} /> Newsletter Riservata</div>
        <h3 className="font-display text-2xl text-neutral-900">Opportunità Off-Market & Osservatorio nella tua casella</h3>
        <p className="text-sm text-neutral-500 mt-1">Ricevi in anteprima immobili selezionati, aste e dati di mercato della Basilicata.</p>
      </div>
      {done ? (
        <div className="flex items-center gap-2 text-emerald font-medium" data-testid="newsletter-done"><Check size={20} /> Iscrizione confermata</div>
      ) : (
        <form onSubmit={submit} className="flex gap-2 w-full lg:w-auto">
          <input data-testid="newsletter-email" type="email" placeholder="La tua email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 lg:w-72 px-4 py-3 rounded-full bg-white border border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold text-neutral-900" />
          <button type="submit" data-testid="newsletter-submit" className="px-6 py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all whitespace-nowrap">Iscriviti</button>
        </form>
      )}
    </div>
  );
};

import React, { useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Upload, DatabaseBackup, Mail, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const BackupSection = () => {
  const fileRef = useRef(null);

  const doExport = async () => {
    const { data } = await api.get("/admin/backup/export");
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supreme-house-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup esportato");
  };

  const doImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const { data } = await api.post("/admin/backup/import", json);
      toast.success("Backup importato: " + Object.keys(data.restored || {}).join(", "));
    } catch {
      toast.error("File di backup non valido");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div data-testid="section-backup">
      <div className="flex items-center gap-2 text-gold mb-5"><DatabaseBackup size={20} /><h2 className="font-display text-2xl text-neutral-900">Backup del Sito — Importa / Esporta</h2></div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="glass-gold rounded-2xl p-6">
          <Download className="text-gold mb-3" size={26} />
          <h3 className="font-display text-xl text-neutral-900">Esporta Backup</h3>
          <p className="text-sm text-neutral-500 mt-1 mb-4">Scarica un file JSON con immobili, quartieri, poli, statistiche, ticker, servizi, bacheca, lead, appuntamenti, link VIP e newsletter.</p>
          <button data-testid="backup-export-btn" onClick={doExport} className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all">Scarica Backup (.json)</button>
        </div>
        <div className="glass-gold rounded-2xl p-6">
          <Upload className="text-gold mb-3" size={26} />
          <h3 className="font-display text-xl text-neutral-900">Importa Backup</h3>
          <p className="text-sm text-neutral-500 mt-1 mb-4">Carica un file di backup per ripristinare i contenuti del sito. Attenzione: sostituisce i dati attuali delle collezioni presenti nel file.</p>
          <input ref={fileRef} type="file" accept="application/json" onChange={doImport} data-testid="backup-import-input" className="hidden" />
          <button data-testid="backup-import-btn" onClick={() => fileRef.current?.click()} className="w-full py-3 rounded-full btn-dark font-semibold">Carica & Ripristina</button>
        </div>
      </div>
    </div>
  );
};

export const NewsletterSection = () => {
  const qc = useQueryClient();
  const { data: subs = [] } = useQuery({ queryKey: ["newsletter"], queryFn: async () => (await api.get("/admin/newsletter")).data });
  const del = async (id) => { await api.delete(`/admin/newsletter/${id}`); qc.invalidateQueries({ queryKey: ["newsletter"] }); };

  return (
    <div data-testid="section-newsletter">
      <div className="flex items-center gap-2 text-gold mb-5"><Mail size={20} /><h2 className="font-display text-2xl text-neutral-900">Newsletter — {subs.length} iscritti</h2></div>
      <div className="glass rounded-2xl overflow-hidden">
        {subs.length === 0 && <div className="py-12 text-center text-neutral-500 text-sm">Nessun iscritto alla newsletter.</div>}
        {subs.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-5 py-3 border-b border-black/5 last:border-0" data-testid={`news-${s.id}`}>
            <div>
              <div className="font-medium text-neutral-900">{s.email}</div>
              {s.name && <div className="text-xs text-neutral-500">{s.name}</div>}
            </div>
            <button onClick={() => del(s.id)} className="text-red-400 hover:scale-110 transition-transform"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

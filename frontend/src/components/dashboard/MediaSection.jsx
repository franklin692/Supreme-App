import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Trash2, Copy } from "lucide-react";
import { api } from "@/lib/api";
import { MediaUpload, toAbsoluteMediaUrl } from "@/components/common/MediaUpload";
import { toast } from "sonner";

export const MediaLibrarySection = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["media"], queryFn: async () => (await api.get("/admin/media")).data });
  const refresh = () => qc.invalidateQueries({ queryKey: ["media"] });

  const del = async (id) => { await api.delete(`/admin/media/${id}`); toast.success("Immagine eliminata"); refresh(); };
  const copy = async (url) => { await navigator.clipboard.writeText(toAbsoluteMediaUrl(url)); toast.success("URL copiato"); };

  return (
    <div data-testid="section-media">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-gold"><ImageIcon size={20} /><h2 className="font-display text-2xl text-neutral-900">Libreria Media</h2></div>
        <MediaUpload testId="media-upload" label="Carica immagine" onUploaded={refresh} />
      </div>
      <p className="text-sm text-neutral-500 mb-5">Carica foto, loghi e banner. Usa <span className="text-gold">Copia URL</span> per riutilizzarli in annunci, hero, logo o altrove.</p>

      {items.length === 0 ? (
        <div className="text-sm text-neutral-400 text-center py-12 glass-gold rounded-2xl">Nessuna immagine caricata. Usa "Carica immagine".</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m) => (
            <div key={m.id} className="glass-gold rounded-xl overflow-hidden group" data-testid={`media-item-${m.id}`}>
              <div className="relative h-32 bg-neutral-100">
                <img src={toAbsoluteMediaUrl(m.url)} alt={m.filename} className="w-full h-full object-cover" />
              </div>
              <div className="p-2.5">
                <div className="text-xs text-neutral-700 truncate" title={m.filename}>{m.filename}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => copy(m.url)} data-testid={`media-copy-${m.id}`} className="flex items-center gap-1 text-xs text-gold hover:underline"><Copy size={12} /> Copia URL</button>
                  <button onClick={() => del(m.id)} data-testid={`media-del-${m.id}`} className="ml-auto text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

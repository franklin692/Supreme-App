import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Save } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaUpload } from "@/components/common/MediaUpload";
import { toast } from "sonner";

const inp = "bg-white border-black/10 focus-visible:ring-gold text-sm";

const PAGES = [
  { id: "home", name: "Home", texts: false },
  { id: "immobili", name: "Immobili", texts: true },
  { id: "servizi", name: "Servizi", texts: true },
  { id: "chi_cerca", name: "Chi Cerca", texts: true },
];

export const PagesSeoSection = () => {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });
  const [pages, setPages] = useState({});
  const [seo, setSeo] = useState({ site_title: "", default_description: "", og_image: "", pages: {} });

  useEffect(() => {
    if (data) {
      setPages(data.pages || {});
      setSeo({ site_title: data.seo?.site_title || "", default_description: data.seo?.default_description || "", og_image: data.seo?.og_image || "", pages: data.seo?.pages || {} });
    }
  }, [data]);

  const setPageText = (id, k, v) => setPages((p) => ({ ...p, [id]: { ...p[id], [k]: v } }));
  const setPageSeo = (id, k, v) => setSeo((p) => ({ ...p, pages: { ...p.pages, [id]: { ...p.pages[id], [k]: v } } }));

  const save = async () => {
    try {
      await api.put("/admin/settings", { pages, seo });
      toast.success("Pagine & SEO salvati"); qc.invalidateQueries({ queryKey: ["settings"] });
    } catch { toast.error("Errore nel salvataggio"); }
  };

  return (
    <div data-testid="section-pages-seo">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-gold"><Search size={20} /><h2 className="font-display text-2xl text-neutral-900">Pagine & SEO</h2></div>
        <button data-testid="pages-seo-save" onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Save size={14} /> Salva</button>
      </div>

      <div className="glass-gold rounded-2xl p-5 mb-5">
        <h3 className="font-display text-lg text-neutral-900 mb-3">SEO globale</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="text-[11px] text-neutral-500 mb-1 block">Titolo sito (default)</label><Input data-testid="seo-site-title" value={seo.site_title} onChange={(e) => setSeo({ ...seo, site_title: e.target.value })} className={inp} /></div>
          <div><label className="text-[11px] text-neutral-500 mb-1 block">Immagine social (og:image)</label>
            <div className="flex gap-2">
              <Input value={seo.og_image} onChange={(e) => setSeo({ ...seo, og_image: e.target.value })} className={inp + " flex-1"} placeholder="URL immagine" />
              <MediaUpload testId="seo-og-upload" label="Carica" onUploaded={(url) => setSeo({ ...seo, og_image: url })} />
            </div>
          </div>
          <div className="sm:col-span-2"><label className="text-[11px] text-neutral-500 mb-1 block">Descrizione default</label><Textarea data-testid="seo-default-desc" value={seo.default_description} onChange={(e) => setSeo({ ...seo, default_description: e.target.value })} className={inp + " min-h-[60px]"} /></div>
        </div>
      </div>

      <div className="space-y-4">
        {PAGES.map((pg) => (
          <div key={pg.id} className="glass-gold rounded-2xl p-5" data-testid={`pageseo-${pg.id}`}>
            <h3 className="font-display text-lg text-neutral-900 mb-3">{pg.name}</h3>
            {pg.texts && (
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div><label className="text-[11px] text-neutral-500 mb-1 block">Eyebrow</label><Input data-testid={`page-${pg.id}-eyebrow`} value={pages[pg.id]?.eyebrow || ""} onChange={(e) => setPageText(pg.id, "eyebrow", e.target.value)} className={inp} /></div>
                <div><label className="text-[11px] text-neutral-500 mb-1 block">Titolo pagina</label><Input data-testid={`page-${pg.id}-title`} value={pages[pg.id]?.title || ""} onChange={(e) => setPageText(pg.id, "title", e.target.value)} className={inp} /></div>
                <div className="sm:col-span-2"><label className="text-[11px] text-neutral-500 mb-1 block">Sottotitolo pagina</label><Textarea data-testid={`page-${pg.id}-subtitle`} value={pages[pg.id]?.subtitle || ""} onChange={(e) => setPageText(pg.id, "subtitle", e.target.value)} className={inp + " min-h-[52px]"} /></div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3 pt-1 border-t border-black/5">
              <div className="pt-3"><label className="text-[11px] text-neutral-500 mb-1 block">SEO · Title</label><Input data-testid={`seo-${pg.id}-title`} value={seo.pages[pg.id]?.title || ""} onChange={(e) => setPageSeo(pg.id, "title", e.target.value)} className={inp} /></div>
              <div className="pt-3"><label className="text-[11px] text-neutral-500 mb-1 block">SEO · Description</label><Textarea data-testid={`seo-${pg.id}-desc`} value={seo.pages[pg.id]?.description || ""} onChange={(e) => setPageSeo(pg.id, "description", e.target.value)} className={inp + " min-h-[52px]"} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu as MenuIcon, PanelBottom, Save, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const inp = "bg-white border-black/10 focus-visible:ring-gold text-sm";

const move = (arr, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const c = [...arr];
  [c[i], c[j]] = [c[j], c[i]];
  return c;
};

const useSettings = () => useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });

/* ---------------- Navbar / Menu ---------------- */
export const NavbarSection = () => {
  const qc = useQueryClient();
  const { data } = useSettings();
  const [brand, setBrand] = useState("");
  const [tagline, setTagline] = useState("");
  const [nav, setNav] = useState({ logo_letter: "S", logo_image: "", items: [] });

  useEffect(() => {
    if (data) {
      setBrand(data.brand_name || "");
      setTagline(data.brand_tagline || "");
      setNav({ logo_letter: data.navbar?.logo_letter || "S", logo_image: data.navbar?.logo_image || "", items: data.navbar?.items || [] });
    }
  }, [data]);

  const setItem = (i, k, v) => setNav((p) => ({ ...p, items: p.items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)) }));

  const save = async () => {
    try {
      await api.put("/admin/settings", { brand_name: brand, brand_tagline: tagline, navbar: nav });
      toast.success("Menu e logo salvati"); qc.invalidateQueries({ queryKey: ["settings"] });
    } catch { toast.error("Errore nel salvataggio"); }
  };

  return (
    <div data-testid="section-navbar">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gold"><MenuIcon size={20} /><h2 className="font-display text-2xl text-neutral-900">Menu & Logo</h2></div>
        <button data-testid="navbar-save" onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Save size={14} /> Salva</button>
      </div>

      <div className="glass-gold rounded-2xl p-5 mb-5 grid sm:grid-cols-2 gap-3">
        <div><label className="text-[11px] text-neutral-500 mb-1 block">Nome Brand</label><Input data-testid="nav-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={inp} /></div>
        <div><label className="text-[11px] text-neutral-500 mb-1 block">Sottotitolo Brand</label><Input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inp} /></div>
        <div><label className="text-[11px] text-neutral-500 mb-1 block">Lettera logo (se nessuna immagine)</label><Input value={nav.logo_letter} onChange={(e) => setNav({ ...nav, logo_letter: e.target.value.slice(0, 2) })} className={inp} /></div>
        <div><label className="text-[11px] text-neutral-500 mb-1 block">Logo immagine (URL)</label><Input data-testid="nav-logo-image" value={nav.logo_image} onChange={(e) => setNav({ ...nav, logo_image: e.target.value })} className={inp} placeholder="https://..." /></div>
      </div>

      <div className="glass-gold rounded-2xl p-5">
        <h3 className="font-display text-lg text-neutral-900 mb-3">Voci di menu</h3>
        <div className="space-y-2">
          {nav.items.map((it, i) => (
            <div key={it.to} className="flex items-center gap-2 bg-white rounded-xl border border-black/5 p-2.5" data-testid={`nav-item-${i}`}>
              <div className="flex flex-col">
                <button onClick={() => setNav({ ...nav, items: move(nav.items, i, -1) })} className="text-neutral-400 hover:text-gold"><ArrowUp size={14} /></button>
                <button onClick={() => setNav({ ...nav, items: move(nav.items, i, 1) })} className="text-neutral-400 hover:text-gold"><ArrowDown size={14} /></button>
              </div>
              <Input value={it.label} onChange={(e) => setItem(i, "label", e.target.value)} className={inp + " flex-1"} data-testid={`nav-item-label-${i}`} />
              <span className="text-[11px] font-mono text-neutral-400 w-24 truncate">{it.to}</span>
              <label className="flex items-center gap-1.5 text-xs text-neutral-600">
                <Switch checked={it.visible !== false} onCheckedChange={(v) => setItem(i, "visible", v)} data-testid={`nav-item-visible-${i}`} />
                {it.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
              </label>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-400 mt-3">Le destinazioni delle voci sono fisse (pagine del sito). Puoi rinominarle, nasconderle e riordinarle.</p>
      </div>
    </div>
  );
};

/* ---------------- Footer ---------------- */
const SOCIAL_OPTIONS = ["Instagram", "Facebook", "Linkedin", "Youtube", "Twitter"];

export const FooterSection = () => {
  const qc = useQueryClient();
  const { data } = useSettings();
  const [desc, setDesc] = useState("");
  const [f, setF] = useState({ col1_title: "", col1_items: [], col2_title: "", col2_items: [], phone: "", whatsapp: "", email: "", address: "", socials: [], copyright_suffix: "" });

  useEffect(() => {
    if (data) {
      setDesc(data.footer_desc || "");
      setF({
        col1_title: data.footer?.col1_title || "Presidi", col1_items: data.footer?.col1_items || [],
        col2_title: data.footer?.col2_title || "Contatti", col2_items: data.footer?.col2_items || [],
        phone: data.footer?.phone || "", whatsapp: data.footer?.whatsapp || "", email: data.footer?.email || "",
        address: data.footer?.address || "", socials: data.footer?.socials || [], copyright_suffix: data.footer?.copyright_suffix || "",
      });
    }
  }, [data]);

  const save = async () => {
    try {
      await api.put("/admin/settings", { footer_desc: desc, footer: f });
      toast.success("Footer salvato"); qc.invalidateQueries({ queryKey: ["settings"] });
    } catch { toast.error("Errore nel salvataggio"); }
  };

  return (
    <div data-testid="section-footer">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gold"><PanelBottom size={20} /><h2 className="font-display text-2xl text-neutral-900">Footer & Contatti</h2></div>
        <button data-testid="footer-save" onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Save size={14} /> Salva</button>
      </div>

      <div className="glass-gold rounded-2xl p-5 mb-5">
        <label className="text-[11px] text-neutral-500 mb-1 block">Descrizione footer</label>
        <Textarea data-testid="footer-desc" value={desc} onChange={(e) => setDesc(e.target.value)} className={inp + " min-h-[70px]"} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div className="glass-gold rounded-2xl p-5">
          <Input value={f.col1_title} onChange={(e) => setF({ ...f, col1_title: e.target.value })} className={inp + " mb-3 font-semibold"} placeholder="Titolo colonna 1" />
          <StrList items={f.col1_items} onChange={(v) => setF({ ...f, col1_items: v })} testPrefix="footer-col1" />
        </div>
        <div className="glass-gold rounded-2xl p-5">
          <Input value={f.col2_title} onChange={(e) => setF({ ...f, col2_title: e.target.value })} className={inp + " mb-3 font-semibold"} placeholder="Titolo colonna 2" />
          <StrList items={f.col2_items} onChange={(v) => setF({ ...f, col2_items: v })} testPrefix="footer-col2" />
        </div>
      </div>

      <div className="glass-gold rounded-2xl p-5 mb-5 grid sm:grid-cols-2 gap-3">
        <div><label className="text-[11px] text-neutral-500 mb-1 block">Telefono</label><Input data-testid="footer-phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={inp} /></div>
        <div><label className="text-[11px] text-neutral-500 mb-1 block">WhatsApp</label><Input data-testid="footer-whatsapp" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} className={inp} /></div>
        <div><label className="text-[11px] text-neutral-500 mb-1 block">Email</label><Input data-testid="footer-email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={inp} /></div>
        <div><label className="text-[11px] text-neutral-500 mb-1 block">Indirizzo</label><Input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} className={inp} /></div>
        <div className="sm:col-span-2"><label className="text-[11px] text-neutral-500 mb-1 block">Testo copyright (destra)</label><Input value={f.copyright_suffix} onChange={(e) => setF({ ...f, copyright_suffix: e.target.value })} className={inp} /></div>
      </div>

      <div className="glass-gold rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-neutral-900">Link social</h3>
          <button data-testid="footer-social-add" onClick={() => setF({ ...f, socials: [...f.socials, { platform: "Instagram", url: "" }] })} className="flex items-center gap-1 text-gold text-sm"><Plus size={14} /> Aggiungi</button>
        </div>
        <div className="space-y-2">
          {f.socials.map((s, i) => (
            <div key={i} className="flex items-center gap-2" data-testid={`footer-social-${i}`}>
              <Select value={s.platform} onValueChange={(v) => setF({ ...f, socials: f.socials.map((x, idx) => (idx === i ? { ...x, platform: v } : x)) })}>
                <SelectTrigger className={inp + " w-36"}><SelectValue /></SelectTrigger>
                <SelectContent>{SOCIAL_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={s.url} onChange={(e) => setF({ ...f, socials: f.socials.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)) })} className={inp + " flex-1"} placeholder="https://..." />
              <button onClick={() => setF({ ...f, socials: f.socials.filter((_, idx) => idx !== i) })} className="text-red-400"><Trash2 size={15} /></button>
            </div>
          ))}
          {f.socials.length === 0 && <p className="text-xs text-neutral-400">Nessun link social. I social appaiono nel footer solo se inserisci un URL.</p>}
        </div>
      </div>
    </div>
  );
};

const StrList = ({ items, onChange, testPrefix }) => (
  <div className="space-y-2">
    {items.map((x, i) => (
      <div key={i} className="flex items-center gap-2" data-testid={`${testPrefix}-item-${i}`}>
        <Input value={x} onChange={(e) => onChange(items.map((it, idx) => (idx === i ? e.target.value : it)))} className={inp + " flex-1"} />
        <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-400"><Trash2 size={14} /></button>
      </div>
    ))}
    <button onClick={() => onChange([...items, ""])} className="flex items-center gap-1 text-gold text-sm" data-testid={`${testPrefix}-add`}><Plus size={14} /> Aggiungi voce</button>
  </div>
);

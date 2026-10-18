import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Eye, Share2, ArrowLeft, Bell, ShieldCheck, Check, Lock, MapPin, Clock,
  Bath, Layers, ArrowUpDown, Car, Zap, TrendingDown, Hospital, GraduationCap,
  MoveVertical, ShoppingBag, Flame, Maximize2, BedDouble, Phone, MessageCircle,
} from "lucide-react";
import { api, formatPrice, waLink } from "@/lib/api";
import { StatusBadge } from "@/components/common/Primitives";
import { Seo } from "@/components/common/Seo";
import { LeadDialog } from "@/components/common/LeadDialog";
import { BeforeAfterSlider } from "@/components/property/BeforeAfterSlider";
import { DarkMap } from "@/components/property/DarkMap";

const AGENCY_WA = "+390971000000";

export default function PropertyDetail() {
  const { id } = useParams();
  const [active, setActive] = useState(0);
  const [planUnlocked, setPlanUnlocked] = useState(false);
  const { data: p, isLoading } = useQuery({ queryKey: ["property", id], queryFn: async () => (await api.get(`/properties/${id}`)).data });

  if (isLoading) return <div className="max-w-6xl mx-auto px-5 py-24 text-center text-neutral-500">Caricamento dossier...</div>;
  if (!p) return <div className="max-w-6xl mx-auto px-5 py-24 text-center">Immobile non trovato.</div>;

  const dist = p.distances || {};
  const features = [
    { icon: Maximize2, value: `${p.mq ?? "—"} mq`, label: "Superficie" },
    { icon: BedDouble, value: p.rooms ?? "—", label: "Camere" },
    { icon: Bath, value: p.bathrooms ?? "—", label: "Bagni" },
    { icon: ArrowUpDown, value: p.floor ?? "—", label: "Piano" },
    { icon: Zap, value: p.energy_class ?? "—", label: "Classe" },
    { icon: Car, value: p.garage ? "Sì" : "No", label: "Box/Posto" },
  ];
  const caratteristiche = [
    p.elevator ? "Ascensore" : null,
    p.garage ? `Box/Posto auto: ${p.garage}` : null,
    p.heating ? `Riscaldamento: ${p.heating}` : null,
    p.condo_fee ? `Condominio: ${p.condo_fee}` : null,
    p.rendita_stimata ? `Rendita stimata: ${p.rendita_stimata}` : null,
    `Classe energetica: ${p.energy_class || "—"}`,
  ].filter(Boolean);

  return (
    <div className="pb-28">
      <Seo title={p.seo_title || `${p.title} — Supreme House`} description={p.seo_description || p.advisor_note || `${p.title} a ${p.neighborhood || ""}, ${p.city || "Basilicata"}.`} image={p.photos?.[0]} />
      {/* Gallery */}
      <div className="relative lg:max-w-6xl lg:mx-auto lg:px-8 lg:pt-6">
        <div className="relative h-72 sm:h-[460px] overflow-hidden lg:rounded-3xl">
          <img src={p.photos?.[active]} alt={p.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex flex-col gap-2 max-w-[80%]">
            {(p.status_badges || []).map((b, i) => <StatusBadge key={i} label={b} />)}
          </div>
          {p.photos?.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {p.photos.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} data-testid={`pd-dot-${i}`}
                  className={`h-2 rounded-full transition-all duration-300 ${active === i ? "w-7 bg-white" : "w-2 bg-white/60"}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 lg:px-8 -mt-8 relative">
        <div className="glass rounded-3xl p-6 lg:p-8">
          <Link to="/immobili" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-gold mb-4 transition-colors"><ArrowLeft size={16} /> Torna al catalogo</Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold pill-dark px-3 py-1.5 rounded-full">{p.ref_code}</span>
            <span className="text-xs font-semibold metallic px-3 py-1.5 rounded-full">{p.type === "asta" ? "Asta Giudiziaria" : p.type === "offmarket" ? "Off-Market" : "Disponibile"}</span>
          </div>

          <h1 className="font-display text-3xl lg:text-5xl font-bold text-neutral-900 leading-tight">{p.title}</h1>
          <div className="flex items-center gap-1.5 text-neutral-500 mt-2"><MapPin size={16} className="text-gold" /> {p.neighborhood}, {p.city}</div>

          <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-1">
            {p.old_price && (
              <span className="text-lg line-through text-neutral-400 font-mono">{formatPrice(p.old_price)}</span>
            )}
            <span className="font-display text-4xl lg:text-5xl font-bold text-neutral-900">{formatPrice(p.price, p.price_period)}</span>
            {p.discount_pct && <span className="flex items-center gap-0.5 text-sm text-red-500 font-mono mb-1.5"><TrendingDown size={14} /> {p.discount_pct}% · Opportunità del mese</span>}
          </div>

          {/* hype pills */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 rounded-full font-mono text-neutral-700"><Eye size={13} className="text-gold" /> {p.views?.toLocaleString("it-IT")} visualizzazioni</span>
            <span className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 rounded-full font-mono text-neutral-700"><Share2 size={13} className="text-emerald" /> Condiviso {p.whatsapp_shares} volte</span>
            {p.observing_now && <span className="flex items-center gap-2 bg-red-50 text-red-500 px-3 py-1.5 rounded-full" data-testid="pd-observing"><span className="live-dot" /> {p.observing_count} stanno guardando ora</span>}
            <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full"><Clock size={13} /> Ultima richiesta {p.last_request_hours}h fa</span>
          </div>

          {/* Feature cards */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-gold rounded-2xl p-4 text-center" data-testid={`pd-feat-${i}`}>
                  <Icon size={20} className="text-gold mx-auto mb-2" />
                  <div className="font-display text-lg font-bold text-neutral-900">{f.value}</div>
                  <div className="text-[11px] text-neutral-500">{f.label}</div>
                </div>
              );
            })}
          </div>

          {/* thumbnails */}
          {p.photos?.length > 1 && (
            <div className="mt-6 flex gap-3 overflow-x-auto no-scrollbar">
              {p.photos.map((ph, i) => (
                <button key={i} onClick={() => setActive(i)} className={`w-28 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition ${active === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={ph} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Before/After */}
          {p.before_photo && p.after_photo && (
            <div className="mt-8">
              <h3 className="font-display text-2xl text-neutral-900 mb-3 flex items-center gap-2"><MoveVertical size={18} className="text-gold" /> Stato Attuale ↔ Potenziale Ristrutturato</h3>
              <BeforeAfterSlider before={p.before_photo} after={p.after_photo} testId="pd-before-after" />
            </div>
          )}

          {/* Advisor note / Descrizione */}
          {p.advisor_note && (
            <div className="mt-8">
              <h3 className="font-display text-2xl text-neutral-900 mb-3">Descrizione & Nota dell'Advisor</h3>
              <div className="glass-gold rounded-2xl p-5" data-testid="pd-advisor-note">
                <div className="flex items-center gap-2 text-gold mb-2">🎙️ <span className="font-display text-lg">La Nota dell'Advisor</span></div>
                <p className="text-neutral-700 leading-relaxed italic">"{p.advisor_note}"</p>
                <div className="text-xs text-neutral-500 mt-3 text-right">— Direzione Tecnica Supreme House</div>
              </div>
            </div>
          )}

          {/* Caratteristiche */}
          <div className="mt-8">
            <h3 className="font-display text-2xl text-neutral-900 mb-3">Caratteristiche</h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {caratteristiche.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-neutral-700"><Check size={18} className="text-emerald mt-0.5 shrink-0" /> {c}</div>
              ))}
            </div>
          </div>

          {/* Iper-Potentini */}
          <div className="mt-8 glass-gold rounded-2xl p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Badge Iper-Potentini · Tempi ai 4 Poli</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Iper icon={Hospital} label="Ospedale San Carlo" value={`${dist.ospedale ?? "—"} min`} />
              <Iper icon={GraduationCap} label="UNIBAS Macchia Romana" value={`${dist.unibas ?? "—"} min`} />
              <Iper icon={MoveVertical} label="Scale Mobili" value={`${dist.scale_mobili ?? "—"} m`} />
              <Iper icon={ShoppingBag} label="Gallitello / Regione" value={`${dist.gallitello ?? "—"} min`} />
            </div>
          </div>

          {/* Scudo + thermometer */}
          {p.pre_verified && (
            <div className="mt-6 glass-gold rounded-2xl p-5" data-testid="pd-shield">
              <div className="flex items-center gap-2 text-gold font-semibold mb-3"><ShieldCheck size={20} /> Immobile Pre-Verificato Supreme House</div>
              <div className="space-y-2">
                {(p.verification_checks || []).map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-neutral-700"><Check size={16} className="text-emerald mt-0.5 shrink-0" /> {c}</div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-black/5 text-sm text-neutral-600">🌡️ Costi di gestione: Bassi/Medi — {p.heating} · Condominio {p.condo_fee} · Classe {p.energy_class}</div>
            </div>
          )}

          {/* Price alert */}
          <LeadDialog testId="pd-price-alert" requestType="Avvisami se scende di prezzo" property={p}
            title="🔔 Avvisami se scende di prezzo" description="Ti avviseremo su WhatsApp appena il prezzo scende." showTimeSlot={false}
            successMessage="Perfetto! Ti avviseremo su WhatsApp al primo ribasso."
            trigger={<button data-testid="pd-price-alert-btn" className="mt-6 w-full py-3.5 rounded-full border border-gold/50 text-gold hover:bg-gold/10 transition-colors font-medium flex items-center justify-center gap-2"><Bell size={16} /> Avvisami se scende di prezzo</button>} />

          {/* Planimetria */}
          <div className="mt-8">
            <h3 className="font-display text-2xl text-neutral-900 mb-3 flex items-center gap-2"><Lock size={18} className="text-gold" /> Planimetria & Perizia</h3>
            <div className="relative rounded-2xl overflow-hidden glass-gold" data-testid="pd-floorplan">
              <img src={p.floorplan_photo} alt="planimetria" className={`w-full h-64 object-cover transition-all duration-500 ${planUnlocked ? "" : "blur-xl brightness-75"}`} />
              {!planUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 shimmer bg-white/40">
                  <div className="w-12 h-12 rounded-full metallic flex items-center justify-center mb-3"><Lock size={20} /></div>
                  <p className="text-sm text-neutral-700 max-w-sm">Per tutelare la privacy, sblocca gratuitamente la planimetria e il dossier con Nome e WhatsApp.</p>
                  <LeadDialog testId="pd-unlock-plan" requestType="Sblocco Planimetria & Dossier" property={p}
                    title="Sblocca Planimetria & Dossier" description="La sfocatura si rimuove all'istante." showTimeSlot={false}
                    successMessage="Planimetria sbloccata! Il dossier ti arriverà su WhatsApp." onSuccess={() => setPlanUnlocked(true)}
                    trigger={<button data-testid="pd-unlock-plan-btn" className="mt-4 px-6 py-2.5 rounded-full metallic font-semibold hover:brightness-110 transition-all">Sblocca Gratuitamente</button>} />
                </div>
              )}
            </div>
          </div>

          {/* Posizione */}
          {p.lat && (
            <div className="mt-8">
              <h3 className="font-display text-2xl text-neutral-900 mb-3 flex items-center gap-2"><MapPin size={18} className="text-gold" /> Posizione</h3>
              <DarkMap markers={[{ ...p }]} center={[p.lat, p.lng]} zoom={15} height="320px" clickable={false} />
              <p className="text-xs text-neutral-500 mt-2">Posizione approssimativa. Contattaci per l'indirizzo esatto.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-[74px] lg:bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-black/10">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center gap-3">
          <LeadDialog testId="pd-visit" requestType="Richiesta Visita / Informazioni" property={p}
            title="Richiedi una visita o informazioni" description="Scegli quando preferisci essere contattato dal Responsabile."
            trigger={<button data-testid="pd-visit-btn" className="flex-1 py-3.5 rounded-full btn-dark font-semibold text-base">Richiedi informazioni</button>} />
          <a href={waLink(AGENCY_WA)} target="_blank" rel="noreferrer" data-testid="pd-wa" className="w-14 h-12 rounded-2xl bg-emerald/15 text-emerald flex items-center justify-center hover:bg-emerald/25 transition-colors"><MessageCircle size={22} /></a>
          <a href={`tel:${AGENCY_WA}`} data-testid="pd-phone" className="w-14 h-12 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center hover:bg-neutral-200 transition-colors"><Phone size={20} /></a>
        </div>
      </div>
    </div>
  );
}

const Iper = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Icon size={18} className="text-gold shrink-0" />
    <div><div className="text-neutral-900 font-semibold text-sm">{value}</div><div className="text-[11px] text-neutral-500 leading-tight">{label}</div></div>
  </div>
);

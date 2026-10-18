import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Eye, Share2, ArrowLeft, Bell, ShieldCheck, Check, Lock, MapPin, Clock,
  Building, Bath, Layers, ArrowUpDown, Car, Zap, TrendingDown, Hospital,
  GraduationCap, MoveVertical, ShoppingBag, Flame,
} from "lucide-react";
import { api, formatPrice } from "@/lib/api";
import { StatusBadge } from "@/components/common/Primitives";
import { LeadDialog } from "@/components/common/LeadDialog";
import { BeforeAfterSlider } from "@/components/property/BeforeAfterSlider";
import { DarkMap } from "@/components/property/DarkMap";

export default function PropertyDetail() {
  const { id } = useParams();
  const [active, setActive] = useState(0);
  const [shieldOpen, setShieldOpen] = useState(false);
  const [planUnlocked, setPlanUnlocked] = useState(false);

  const { data: p, isLoading } = useQuery({ queryKey: ["property", id], queryFn: async () => (await api.get(`/properties/${id}`)).data });

  if (isLoading) return <div className="max-w-6xl mx-auto px-5 py-20 text-center text-muted-foreground">Caricamento dossier...</div>;
  if (!p) return <div className="max-w-6xl mx-auto px-5 py-20 text-center">Immobile non trovato.</div>;

  const dist = p.distances || {};

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8 lg:py-12">
      <Link to="/immobili" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-6 transition-colors">
        <ArrowLeft size={16} /> Torna al catalogo
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* ===== Left: gallery + before/after + plan + map ===== */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative rounded-2xl overflow-hidden glass-gold" data-testid="pd-gallery">
            <img src={p.photos?.[active]} alt={p.title} className="w-full h-72 sm:h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 flex flex-col gap-2 max-w-[75%]">
              {(p.status_badges || []).map((b, i) => <StatusBadge key={i} label={b} />)}
            </div>
            <div className="absolute top-4 right-4 text-xs font-mono bg-obsidian/80 border border-gold/30 text-gold px-2.5 py-1 rounded">{p.ref_code}</div>
          </div>
          {p.photos?.length > 1 && (
            <div className="flex gap-3">
              {p.photos.map((ph, i) => (
                <button key={i} onClick={() => setActive(i)} data-testid={`pd-thumb-${i}`}
                  className={`w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${active === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={ph} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Before / After */}
          {p.before_photo && p.after_photo && (
            <div>
              <h3 className="font-display text-xl text-white mb-3 flex items-center gap-2"><MoveVertical size={18} className="text-gold" /> Stato Attuale ↔ Potenziale Ristrutturato</h3>
              <BeforeAfterSlider before={p.before_photo} after={p.after_photo} testId="pd-before-after" />
              <p className="text-xs text-muted-foreground mt-2">Trascina la linea dorata per confrontare lo stato attuale con il rendering ristrutturato.</p>
            </div>
          )}

          {/* Planimetria blurred */}
          <div>
            <h3 className="font-display text-xl text-white mb-3 flex items-center gap-2"><Lock size={17} className="text-gold" /> Planimetria Quotata & Perizia</h3>
            <div className="relative rounded-2xl overflow-hidden glass-gold" data-testid="pd-floorplan">
              <img src={p.floorplan_photo} alt="planimetria" className={`w-full h-64 object-cover transition-all duration-500 ${planUnlocked ? "" : "blur-xl brightness-50"}`} />
              {!planUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 shimmer">
                  <div className="w-12 h-12 rounded-full metallic flex items-center justify-center mb-3"><Lock size={20} /></div>
                  <p className="text-sm text-gray-200 max-w-sm">Per tutelare la privacy della proprietà, sblocca gratuitamente la planimetria e il dossier inserendo Nome e Numero WhatsApp.</p>
                  <LeadDialog testId="pd-unlock-plan" requestType="Sblocco Planimetria & Dossier" property={p}
                    title="Sblocca Planimetria & Dossier" description="Inserisci Nome e WhatsApp: la sfocatura si rimuove all'istante."
                    showTimeSlot={false} successMessage="Planimetria sbloccata! Il dossier completo ti arriverà anche su WhatsApp."
                    onSuccess={() => setPlanUnlocked(true)}
                    trigger={<button data-testid="pd-unlock-plan-btn" className="mt-4 px-6 py-2.5 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Sblocca Gratuitamente</button>} />
                </div>
              )}
            </div>
          </div>

          {/* Map exact */}
          {p.lat && (
            <div>
              <h3 className="font-display text-xl text-white mb-3 flex items-center gap-2"><MapPin size={18} className="text-gold" /> Posizione esatta</h3>
              <DarkMap markers={[{ ...p }]} center={[p.lat, p.lng]} zoom={15} height="320px" clickable={false} />
            </div>
          )}
        </div>

        {/* ===== Right: info column ===== */}
        <div className="lg:col-span-2 space-y-5">
          {/* hype */}
          <div className="flex items-center gap-3 text-sm font-mono">
            <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full"><Eye size={14} className="text-gold" /> {p.views?.toLocaleString("it-IT")} visualizzazioni</span>
            <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full"><Share2 size={14} className="text-emerald" /> Condiviso {p.whatsapp_shares} volte</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {p.observing_now && (
              <span className="flex items-center gap-2 text-xs text-red-400 glass px-3 py-1.5 rounded-full" data-testid="pd-observing">
                <span className="live-dot" /> {p.observing_count} persone stanno guardando questa scheda
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-amber glass px-3 py-1.5 rounded-full">
              <Clock size={13} /> Ultima richiesta: {p.last_request_hours} ore fa
            </span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold">{p.neighborhood}, {p.city}</div>
            <h1 className="font-display text-3xl font-bold text-white mt-1 leading-tight">{p.title}</h1>
          </div>

          {/* price */}
          <div className="glass-gold rounded-2xl p-5">
            {p.old_price && (
              <div className="flex items-center gap-2 mb-1">
                <span className="line-through text-muted-foreground font-mono">{formatPrice(p.old_price)}</span>
                <span className="flex items-center gap-0.5 text-sm text-red-400 font-mono"><TrendingDown size={14} /> {p.discount_pct}% · Opportunità del mese</span>
              </div>
            )}
            <div className="font-mono text-4xl font-bold text-gold-gradient">{formatPrice(p.price, p.price_period)}</div>
            <LeadDialog testId="pd-price-alert" requestType="Avvisami se scende di prezzo" property={p}
              title="🔔 Avvisami se scende di prezzo" description="Ti avviseremo su WhatsApp appena il prezzo di questo immobile scende." showTimeSlot={false}
              successMessage="Perfetto! Ti avviseremo su WhatsApp al primo ribasso di prezzo."
              trigger={<button data-testid="pd-price-alert-btn" className="mt-4 w-full py-3 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 font-medium flex items-center justify-center gap-2"><Bell size={16} /> Avvisami se scende di prezzo</button>} />
          </div>

          {/* CTA */}
          <LeadDialog testId="pd-visit" requestType="Richiesta Visita / Informazioni" property={p}
            title="Richiedi una visita o informazioni" description="Scegli quando preferisci essere contattato dal Responsabile di zona."
            trigger={<button data-testid="pd-visit-btn" className="w-full py-4 rounded-full metallic font-semibold text-base hover:brightness-110 transition-all duration-300 gold-glow">Richiedi Visita / Dossier Completo</button>} />

          {/* Iper-Potentini */}
          <div className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Badge Iper-Potentini</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <IperItem icon={Hospital} label="Ospedale San Carlo" value={`${dist.ospedale ?? "—"} min`} />
              <IperItem icon={GraduationCap} label="UNIBAS Macchia Romana" value={`${dist.unibas ?? "—"} min`} />
              <IperItem icon={MoveVertical} label="Scale Mobili" value={`${dist.scale_mobili ?? "—"} m`} />
              <IperItem icon={ShoppingBag} label="Gallitello / Regione" value={`${dist.gallitello ?? "—"} min`} />
            </div>
          </div>

          {/* Termometro spese + dettagli */}
          <div className="glass rounded-2xl p-5">
            <div className="text-sm text-gray-200 mb-3">🌡️ <span className="font-medium">Costi di gestione: Bassi/Medi</span> — {p.heating} · Condominio {p.condo_fee} · Classe Energetica {p.energy_class}</div>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm">
              <Detail icon={Building} label="Superficie" value={`${p.mq} mq`} />
              <Detail icon={Layers} label="Locali" value={p.rooms} />
              <Detail icon={Bath} label="Bagni" value={p.bathrooms} />
              <Detail icon={ArrowUpDown} label="Piano" value={p.floor} />
              <Detail icon={Zap} label="Ascensore" value={p.elevator ? "Sì" : "No"} />
              <Detail icon={Car} label="Garage" value={p.garage} />
            </div>
            {p.rendita_stimata && (
              <div className="mt-3 pt-3 border-t border-white/5 text-sm text-emerald flex items-center gap-2"><Flame size={14} /> Rendita stimata: {p.rendita_stimata}</div>
            )}
          </div>

          {/* Scudo pre-verificato */}
          {p.pre_verified && (
            <div className="glass-gold rounded-2xl p-5" data-testid="pd-shield">
              <button onClick={() => setShieldOpen((v) => !v)} className="w-full flex items-center justify-between" data-testid="pd-shield-btn">
                <span className="flex items-center gap-2 text-gold font-semibold"><ShieldCheck size={20} /> Immobile Pre-Verificato Supreme House</span>
                <span className="text-xs text-muted-foreground">{shieldOpen ? "Nascondi" : "Dettagli"}</span>
              </button>
              {shieldOpen && (
                <div className="mt-4 space-y-2">
                  {(p.verification_checks || []).map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-200">
                      <Check size={16} className="text-emerald mt-0.5 shrink-0" /> {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Nota advisor */}
          {p.advisor_note && (
            <div className="glass-gold rounded-2xl p-5" data-testid="pd-advisor-note">
              <div className="flex items-center gap-2 text-gold mb-2">🎙️ <span className="font-display text-lg">La Nota dell'Advisor</span></div>
              <p className="text-sm text-gray-200 leading-relaxed italic">"{p.advisor_note}"</p>
              <div className="text-xs text-muted-foreground mt-3 text-right">— Direzione Tecnica Supreme House</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const IperItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Icon size={16} className="text-gold shrink-0" />
    <div><div className="text-gray-100 font-medium">{value}</div><div className="text-[11px] text-muted-foreground leading-tight">{label}</div></div>
  </div>
);

const Detail = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Icon size={15} className="text-muted-foreground shrink-0" />
    <span className="text-muted-foreground">{label}:</span>
    <span className="text-gray-100 font-medium">{value}</span>
  </div>
);

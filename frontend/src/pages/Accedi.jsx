import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Hotel, Building2, Handshake, ShieldHalf, Zap, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "user", icon: User, title: "Utente / Acquirente", desc: "Immobili salvati, dossier sbloccati, richieste inviate." },
  { id: "bnb_owner", icon: Hotel, title: "Proprietario B&B / Immobile", desc: "Rendite, bonifici, tasso occupazione e documenti." },
  { id: "condomino", icon: Building2, title: "Condòmino", desc: "Avvisi, rate, verbali e segnalazione guasti." },
  { id: "collaborator", icon: Handshake, title: "Collaboratore / Segnalatore", desc: "Inserisci segnalazioni e segui i tuoi compensi." },
  { id: "admin", icon: ShieldHalf, title: "Agente & Super-Admin", desc: "Gestionale CRM e Cabina di Regia." },
];

export default function Accedi() {
  const [mode, setMode] = useState("choose"); // choose | login | register
  const navigate = useNavigate();
  const { login, demoLogin, register } = useAuth();
  const [selected, setSelected] = useState(null);
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [reg, setReg] = useState({ name: "", username: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);

  const go = (user) => {
    if (user.role === "admin" || user.role === "agent") navigate("/dashboard");
    else navigate("/pannello");
  };

  const doDemo = async (role) => {
    setLoading(true);
    try { const u = await demoLogin(role); toast.success(`Accesso demo come ${u.name}`); go(u); }
    catch { toast.error("Account demo non disponibile"); }
    finally { setLoading(false); }
  };

  const doLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { const u = await login(creds.username, creds.password); toast.success("Accesso effettuato"); go(u); }
    catch (err) { toast.error(err.response?.data?.detail || "Credenziali non valide"); }
    finally { setLoading(false); }
  };

  const doRegister = async (e) => {
    e.preventDefault();
    if (!reg.name || !reg.username || !reg.password) { toast.error("Compila tutti i campi"); return; }
    setLoading(true);
    try { const u = await register(reg); toast.success("Registrazione completata"); go(u); }
    catch (err) { toast.error(err.response?.data?.detail || "Errore registrazione"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-xl metallic flex items-center justify-center mx-auto mb-4 font-display font-black text-xl">S</div>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-white">Portale Supreme House</h1>
        <p className="text-muted-foreground mt-2">Accedi al tuo spazio riservato o crea un nuovo profilo.</p>
      </div>

      {mode === "choose" && (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button data-testid="choose-login" onClick={() => setMode("login")}
            className="py-6 rounded-2xl metallic font-display text-xl font-bold flex flex-col items-center gap-2 hover:brightness-110 transition-all duration-300 gold-glow">
            <LogIn size={26} /> ACCEDI
          </button>
          <button data-testid="choose-register" onClick={() => setMode("register")}
            className="py-6 rounded-2xl glass-gold text-white font-display text-xl font-bold flex flex-col items-center gap-2 hover:border-gold/60 transition-all duration-300">
            <UserPlus size={26} /> REGISTRATI
          </button>
        </div>
      )}

      {mode === "login" && (
        <div>
          <BackBtn onClick={() => { setMode("choose"); setSelected(null); }} />
          <div className="space-y-3">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const open = selected === r.id;
              return (
                <div key={r.id} className={cn("glass-gold rounded-2xl p-5 transition-all duration-300", open && "border-gold/60")}>
                  <button data-testid={`role-${r.id}`} onClick={() => setSelected(open ? null : r.id)} className="w-full flex items-center gap-4 text-left">
                    <div className="w-11 h-11 rounded-xl bg-night border border-gold/20 flex items-center justify-center text-gold shrink-0"><Icon size={20} /></div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                  </button>

                  {open && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      {r.id === "admin" ? (
                        <form onSubmit={doLogin} className="space-y-3">
                          <Input data-testid="login-username" placeholder="Username (admin / agente)" value={creds.username}
                            onChange={(e) => setCreds({ ...creds, username: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
                          <Input data-testid="login-password" type="password" placeholder="Password" value={creds.password}
                            onChange={(e) => setCreds({ ...creds, password: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
                          <button type="submit" disabled={loading} data-testid="login-submit" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 disabled:opacity-60">
                            {loading ? "Accesso..." : "Entra nel Gestionale"}
                          </button>
                          <div className="flex gap-2">
                            <button type="button" data-testid="demo-admin" onClick={() => doDemo("admin")} className="flex-1 py-2.5 rounded-full border border-gold/40 text-gold text-sm hover:bg-gold/10 transition-colors flex items-center justify-center gap-1.5"><Zap size={14} /> Demo Super-Admin</button>
                            <button type="button" data-testid="demo-agent" onClick={() => doDemo("agent")} className="flex-1 py-2.5 rounded-full border border-gold/40 text-gold text-sm hover:bg-gold/10 transition-colors flex items-center justify-center gap-1.5"><Zap size={14} /> Demo Agente</button>
                          </div>
                        </form>
                      ) : (
                        <button data-testid={`demo-${r.id}`} onClick={() => doDemo(r.id)} disabled={loading}
                          className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60">
                          <Zap size={16} /> Accesso Rapido Demo 1-Click
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === "register" && (
        <div className="max-w-md mx-auto">
          <BackBtn onClick={() => setMode("choose")} />
          <form onSubmit={doRegister} className="glass-gold rounded-2xl p-6 space-y-3">
            <Input data-testid="reg-name" placeholder="Nome e Cognome" value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
            <Input data-testid="reg-username" placeholder="Username" value={reg.username} onChange={(e) => setReg({ ...reg, username: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
            <Input data-testid="reg-password" type="password" placeholder="Password" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} className="bg-night/70 border-gold/20 focus-visible:ring-gold" />
            <Select value={reg.role} onValueChange={(v) => setReg({ ...reg, role: v })}>
              <SelectTrigger data-testid="reg-role" className="bg-night/70 border-gold/20 focus:ring-gold"><SelectValue /></SelectTrigger>
              <SelectContent className="glass-gold border-gold/30">
                <SelectItem value="user">Utente / Acquirente</SelectItem>
                <SelectItem value="bnb_owner">Proprietario B&B / Immobile</SelectItem>
                <SelectItem value="condomino">Condòmino</SelectItem>
                <SelectItem value="collaborator">Collaboratore / Segnalatore</SelectItem>
              </SelectContent>
            </Select>
            <button type="submit" disabled={loading} data-testid="reg-submit" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 disabled:opacity-60">
              {loading ? "Registrazione..." : "Crea il tuo profilo"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const BackBtn = ({ onClick }) => (
  <button onClick={onClick} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-5 transition-colors">
    <ArrowLeft size={16} /> Indietro
  </button>
);

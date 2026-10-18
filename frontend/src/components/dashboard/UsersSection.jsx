import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCog, Save } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ROLE_LABEL = {
  admin: "Super-Admin", agent: "Agente", user: "Utente/Acquirente",
  bnb_owner: "Proprietario B&B", condomino: "Condòmino", collaborator: "Segnalatore",
};

export const UsersSection = () => {
  const qc = useQueryClient();
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: async () => (await api.get("/admin/users")).data });

  return (
    <div data-testid="section-users">
      <div className="flex items-center gap-2 text-gold mb-5"><UserCog size={20} /><h2 className="font-display text-2xl text-white">Gestione Utenti, Segnalatori, Proprietari & Condòmini</h2></div>
      <div className="space-y-3">
        {users.map((u) => <Row key={u.id} u={u} onDone={() => qc.invalidateQueries({ queryKey: ["users"] })} />)}
      </div>
    </div>
  );
};

const Row = ({ u, onDone }) => {
  const [commission, setCommission] = useState(u.commission_status || "");
  const save = async () => {
    await api.put(`/admin/users/${u.id}`, { commission_status: commission });
    toast.success("Utente aggiornato"); onDone();
  };
  const isCollab = u.role === "collaborator";
  return (
    <div className="glass-gold rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" data-testid={`user-row-${u.id}`}>
      <div>
        <div className="font-semibold text-white">{u.name} <span className="text-xs text-muted-foreground">@{u.username}</span></div>
        <div className="text-xs text-gold">{ROLE_LABEL[u.role] || u.role}{u.email ? ` · ${u.email}` : ""}</div>
      </div>
      {isCollab && (
        <div className="flex items-center gap-2">
          <Input data-testid={`user-commission-${u.id}`} placeholder="Stato provvigioni" value={commission} onChange={(e) => setCommission(e.target.value)} className="bg-night/70 border-gold/20 focus-visible:ring-gold h-9 w-56" />
          <button data-testid={`user-save-${u.id}`} onClick={save} className="flex items-center gap-1.5 px-3 py-2 rounded-full metallic text-xs font-semibold"><Save size={13} /> Salva</button>
        </div>
      )}
    </div>
  );
};

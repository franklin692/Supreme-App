import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BnbDashboardView, DEMO_BNB_DATA } from "@/components/home/BnbDashboardView";
import { LeadDialog } from "@/components/common/LeadDialog";
import { Smartphone } from "lucide-react";

export const DemoGestionaleDialog = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="contents">{trigger}</div>
      <DialogContent className="glass-gold border-gold/30 max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar" data-testid="demo-gestionale-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-gold-gradient flex items-center gap-2">
            <Smartphone size={22} /> Demo Live Gestionale
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          Ecco come i proprietari clienti Supreme House monitorano il proprio immobile dal telefono, come un conto di Home Banking.
        </p>
        <div className="mt-2">
          <BnbDashboardView data={DEMO_BNB_DATA} />
        </div>
        <LeadDialog
          testId="demo-affida"
          requestType="Affida il tuo immobile (da Demo Gestionale)"
          title="Affida il tuo immobile a Supreme House"
          description="Lascia i tuoi dati: ti mostreremo quanto può rendere il tuo immobile e attiveremo il gestionale."
          trigger={
            <button data-testid="demo-affida-btn" className="w-full mt-2 py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">
              Affida anche il tuo immobile a Supreme House
            </button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

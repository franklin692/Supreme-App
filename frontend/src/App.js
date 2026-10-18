import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeInjector } from "@/components/common/ThemeInjector";
import { Layout } from "@/components/layout/Layout";
import Hub from "@/pages/Hub";
import Immobili from "@/pages/Immobili";
import PropertyDetail from "@/pages/PropertyDetail";
import ChiCerca from "@/pages/ChiCerca";
import Servizi from "@/pages/Servizi";
import ServiceDetail from "@/pages/ServiceDetail";
import Accedi from "@/pages/Accedi";
import Dashboard from "@/pages/Dashboard";
import CabinaRegia from "@/pages/CabinaRegia";
import RolePanel from "@/pages/RolePanel";
import VipPage from "@/pages/VipPage";

function App() {
  return (
    <AuthProvider>
      <ThemeInjector />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Hub />} />
            <Route path="/immobili" element={<Immobili />} />
            <Route path="/immobili/:id" element={<PropertyDetail />} />
            <Route path="/chi-cerca" element={<ChiCerca />} />
            <Route path="/servizi" element={<Servizi />} />
            <Route path="/servizi/:id" element={<ServiceDetail />} />
            <Route path="/accedi" element={<Accedi />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cabina-di-regia" element={<CabinaRegia />} />
            <Route path="/pannello" element={<RolePanel />} />
          </Route>
          <Route path="/vip/:token" element={<VipPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(17,22,34,0.95)",
            border: "1px solid rgba(212,175,55,0.4)",
            color: "#F3F4F6",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { SosProvider, useSos } from './context/SosContext';
import { HeaderBar } from './components/common/HeaderBar';
import { MobileFrame } from './components/mobile/MobileFrame';
import { CopomPanel } from './components/copom/CopomPanel';
import { PinModal } from './components/modals/PinModal';
import { FakeCallModal } from './components/modals/FakeCallModal';
import { ChatbotModal } from './components/modals/ChatbotModal';
import { NewContactModal } from './components/modals/NewContactModal';

function MainLayout() {
  const { viewMode } = useSos();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Barra de Controle de Demonstração e Navegação */}
      <HeaderBar />

      {/* Conteúdo Principal Flexível */}
      <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 p-4 lg:p-6 overflow-x-hidden">
        {(viewMode === 'MOBILE' || viewMode === 'SPLIT') && <MobileFrame />}
        {(viewMode === 'COPOM' || viewMode === 'SPLIT') && <CopomPanel />}
      </main>

      {/* Modais Globais de Segurança */}
      <PinModal />
      <FakeCallModal />
      <ChatbotModal />
      <NewContactModal />
    </div>
  );
}

export default function App() {
  return (
    <SosProvider>
      <MainLayout />
    </SosProvider>
  );
}

import React from 'react';
import { Wifi, WifiOff, Smartphone, Shield, Radio } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function HeaderBar() {
  const {
    viewMode,
    setViewMode,
    mobileScreen,
    setMobileScreen,
    isOnline,
    setIsOnline,
    offlineQueue,
    setCamouflageMode,
    sosActive,
    triggerSOS,
  } = useSos();

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#990012] to-[#60000b] flex items-center justify-center font-black text-white shadow-lg shadow-red-950/50">
          SOS
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-sm text-white tracking-tight">
              SOS Mulheres <span className="text-slate-400 font-normal">| Plataforma Integrada</span>
            </h1>
            <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-800/80 px-2 py-0.5 rounded-full font-semibold">
              PWA + COPOM 190
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Senhas de Teste: <strong className="text-emerald-400">1234</strong> (Encerrar Real) |{' '}
            <strong className="text-amber-400">9999</strong> (Coação Silenciosa) |{' '}
            <strong className="text-sky-400">911=</strong> (Descamuflar Calculadora)
          </p>
        </div>
      </div>

      {/* Seletor Rápido de Telas do PWA */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        {[
          { id: 'LOGIN', label: '1. Login' },
          { id: 'REGISTER', label: '2. Cadastro' },
          { id: 'HOME', label: '3. Início' },
          { id: 'ACTIVE_SOS', label: '4. Alerta Ativo' },
          { id: 'TIPS', label: '5. Dicas' },
          { id: 'CONTACTS', label: '6. Contatos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setCamouflageMode(false);
              setMobileScreen(tab.id);
              if (tab.id === 'ACTIVE_SOS' && !sosActive) triggerSOS();
            }}
            className={`px-2.5 py-1 rounded-lg transition text-xs ${
              mobileScreen === tab.id
                ? 'bg-[#990012] text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Simulador de Rede Offline e Seletor de Telas */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition shadow-sm ${
            isOnline
              ? 'bg-emerald-950/70 border-emerald-700/80 text-emerald-300 hover:bg-emerald-900'
              : 'bg-amber-950 border-amber-600 text-amber-300 animate-pulse'
          }`}
          title="Clique para alternar entre Rede Online e Queda de Conexão (Modo Offline)"
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isOnline ? 'REDE ONLINE (Simular Queda)' : `OFFLINE (${offlineQueue.length} na fila)`}
        </button>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('MOBILE')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition ${
              viewMode === 'MOBILE' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
          <button
            onClick={() => setViewMode('SPLIT')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition ${
              viewMode === 'SPLIT' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Split-Screen
          </button>
          <button
            onClick={() => setViewMode('COPOM')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition ${
              viewMode === 'COPOM' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> COPOM 190
          </button>
        </div>
      </div>
    </header>
  );
}

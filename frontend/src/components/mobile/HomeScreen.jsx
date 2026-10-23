import React from 'react';
import { Menu, Calculator, User, PhoneCall, MapPin } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function HomeScreen() {
  const {
    underDuress,
    setCamouflageMode,
    setMobileScreen,
    setFakeCallModal,
    setChatbotOpen,
    triggerSOS,
  } = useSos();

  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-5 pt-3 pb-3 select-none">
      {/* Topo do Aplicativo */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setChatbotOpen(true)}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
          title="Assistente de Emergência Rápido"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="font-extrabold text-sm text-slate-900 tracking-wide">Início</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCamouflageMode(true)}
            title="Modo Camuflagem (Calculadora)"
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-sm"
          >
            <Calculator className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileScreen('LOGIN')}
            className="w-8 h-8 rounded-xl border border-[#990012] text-[#990012] flex items-center justify-center hover:bg-red-50 transition"
            title="Trocar Usuária"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {underDuress && (
        <div className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] text-center py-1 rounded-lg font-mono">
          Modo silencioso em execução (9999 ativo)
        </div>
      )}

      {/* Pergunta de Apoio */}
      <div className="text-center mt-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Você está em perigo?</h2>
        <p className="text-xs text-slate-500 mt-1 px-4 leading-relaxed">
          Pressione o botão SOS e o socorro policial será mobilizado imediatamente com sua rota GPS.
        </p>
      </div>

      {/* Botão de Pânico com Ondas Con cêntricas Pulsantes */}
      <div className="relative flex items-center justify-center my-auto py-2">
        <div className="w-60 h-60 rounded-full bg-red-100/60 flex items-center justify-center animate-pulse">
          <div className="w-48 h-48 rounded-full bg-red-200/70 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full bg-red-300/80 flex items-center justify-center shadow-lg">
              <button
                onClick={triggerSOS}
                className="w-28 h-28 rounded-full bg-gradient-to-b from-[#bd0017] to-[#7a000e] text-white font-black text-3xl tracking-wider shadow-[0_12px_28px_rgba(153,0,18,0.55)] active:scale-95 hover:scale-105 transition-all flex items-center justify-center"
              >
                SOS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas Dissuasivas */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <button
          onClick={() => setFakeCallModal(true)}
          className="flex items-center gap-1.5 bg-[#990012] hover:bg-[#7e000f] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md active:scale-95 transition"
        >
          <PhoneCall className="w-3.5 h-3.5" /> Ligação Falsa
        </button>
        <button
          onClick={() => setMobileScreen('ACTIVE_SOS')}
          className="flex items-center gap-1.5 bg-[#990012] hover:bg-[#7e000f] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md active:scale-95 transition"
        >
          <MapPin className="w-3.5 h-3.5" /> Localização
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useSos } from '../../context/SosContext';
import { CalculatorCamouflage } from './CalculatorCamouflage';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { HomeScreen } from './HomeScreen';
import { ActiveSosScreen } from './ActiveSosScreen';
import { TipsScreen } from './TipsScreen';
import { ContactsScreen } from './ContactsScreen';
import { BottomNav } from './BottomNav';

export function MobileFrame() {
  const {
    isOnline,
    offlineQueue,
    camouflageMode,
    mobileScreen,
    sosActive,
    underDuress,
    currentCoords,
  } = useSos();

  return (
    <div className="flex flex-col items-center justify-center shrink-0">
      <div className="relative w-[370px] h-[755px] bg-white text-slate-900 rounded-[50px] border-[10px] border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Dynamic Island */}
        <div className="w-28 h-6 bg-black rounded-full mx-auto mt-2.5 z-30 flex items-center justify-end px-3 shrink-0 shadow-sm">
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              sosActive || underDuress ? 'bg-red-500 animate-ping' : 'bg-emerald-700'
            }`}
          />
        </div>

        {/* Banner Offline-First com Fallback de SMS Nativo */}
        {!isOnline && !camouflageMode && (
          <div className="bg-amber-500 text-slate-950 px-3 py-1 text-[11px] font-bold flex items-center justify-between z-20 shadow-sm">
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 shrink-0" /> Sem Rede: GPS gravado no celular ({offlineQueue.length})
            </span>
            <a
              href={`sms:190?body=${encodeURIComponent(
                `SOCORRO SOS MULHERES! Preciso de ajuda imediata. Coordenadas GPS: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`
              )}`}
              className="bg-slate-950 hover:bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold"
            >
              SMS Nativo
            </a>
          </div>
        )}

        {/* Camouflage Mode vs Telas do Sistema */}
        {camouflageMode ? (
          <CalculatorCamouflage />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {mobileScreen === 'LOGIN' && <LoginScreen />}
            {mobileScreen === 'REGISTER' && <RegisterScreen />}
            {mobileScreen === 'HOME' && <HomeScreen />}
            {mobileScreen === 'ACTIVE_SOS' && <ActiveSosScreen />}
            {mobileScreen === 'TIPS' && <TipsScreen />}
            {mobileScreen === 'CONTACTS' && <ContactsScreen />}

            {['HOME', 'ACTIVE_SOS', 'TIPS', 'CONTACTS'].includes(mobileScreen) && <BottomNav />}
          </div>
        )}
      </div>
    </div>
  );
}

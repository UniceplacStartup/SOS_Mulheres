import React from 'react';
import { Home, AlertTriangle, Lightbulb, Users } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function BottomNav() {
  const { mobileScreen, setMobileScreen } = useSos();

  const navItems = [
    { id: 'HOME', label: 'Início', icon: Home },
    { id: 'ACTIVE_SOS', label: 'Emergência', icon: AlertTriangle },
    { id: 'TIPS', label: 'Dicas', icon: Lightbulb },
    { id: 'CONTACTS', label: 'Contatos', icon: Users },
  ];

  return (
    <div className="px-4 pb-3 pt-1 bg-white select-none">
      <div className="bg-[#8c0010] text-white rounded-3xl px-3 py-1.5 flex items-center justify-around shadow-lg shadow-red-950/20">
        {navItems.map((nav) => {
          const IconNav = nav.icon;
          const active = mobileScreen === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => setMobileScreen(nav.id)}
              className="flex flex-col items-center gap-0.5 py-1 px-2 transition-all active:scale-95"
            >
              <div className={`p-1.5 rounded-full transition ${active ? 'bg-white/20' : ''}`}>
                <IconNav className="w-4 h-4" />
              </div>
              <span className={`text-[10px] ${active ? 'font-black' : 'font-medium text-red-200'}`}>
                {nav.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

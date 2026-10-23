import React from 'react';
import { ChevronLeft, Send, Key, Car, Sun, Heart, MessageSquare } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function TipsScreen() {
  const { setMobileScreen, setChatbotOpen } = useSos();

  const tips = [
    {
      icon: Send,
      title: 'Compartilhe sua rota',
      desc: 'Sempre avise alguém de confiança quando sair sozinha ou pegar transporte.',
    },
    {
      icon: Key,
      title: 'Código de emergência',
      desc: 'Combine uma palavra-chave com amigos e familiares para pedir socorro discretamente.',
    },
    {
      icon: Car,
      title: 'Transporte seguro',
      desc: 'Ao embarcar em carros de aplicativo, verifique placa, modelo e compartilhe a viagem.',
    },
    {
      icon: Sun,
      title: 'Lugares movimentados',
      desc: 'Evite vias escuras ou becos. Procure estabelecimentos comerciais abertos.',
    },
    {
      icon: Heart,
      title: 'Confie no seu instinto',
      desc: 'Se perceber atitudes suspeitas, procure abrigo e acione o botão SOS imediatamente.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="bg-[#990012] pt-11 pb-4 px-5 rounded-b-[28px] text-white -mt-9 shadow-md">
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => setMobileScreen('HOME')}
            className="p-1 hover:bg-white/10 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-black">Dicas de Segurança</h2>
            <p className="text-[11px] text-red-100 font-medium">Previna-se. Proteja-se com inteligência.</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2.5 flex-1 overflow-y-auto">
        {tips.map((tip, idx) => {
          const IconComp = tip.icon;
          return (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-start gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-red-100 text-[#990012] shrink-0">
                <IconComp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{tip.title}</h4>
                <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{tip.desc}</p>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => setChatbotOpen(true)}
          className="w-full bg-[#990012] hover:bg-[#7e000f] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition active:scale-[0.98]"
        >
          <MessageSquare className="w-4 h-4" /> Abrir Assistente de Emergência Rápido
        </button>
      </div>
    </div>
  );
}

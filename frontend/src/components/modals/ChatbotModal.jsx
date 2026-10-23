import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function ChatbotModal() {
  const { chatbotOpen, setChatbotOpen, chatHistory, handleQuickChat } = useSos();

  if (!chatbotOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/70 z-50 flex flex-col justify-end animate-fadeIn">
      <div className="bg-white rounded-t-[32px] p-5 h-[80%] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-100 text-[#990012]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-900">Assistente SOS Rápido</h4>
              <p className="text-[10px] text-slate-500">Orientações imediatas e discretas</p>
            </div>
          </div>
          <button
            onClick={() => setChatbotOpen(false)}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
          {chatHistory.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl text-xs max-w-[88%] leading-relaxed ${
                m.sender === 'BOT'
                  ? 'bg-slate-100 text-slate-800 self-start border border-slate-200/60'
                  : 'bg-[#990012] text-white ml-auto shadow-sm'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t">
          {['Estou sendo seguida', 'Violência em casa agora', 'Código de Coação', 'Delegacia mais próxima'].map(
            (q) => (
              <button
                key={q}
                onClick={() => handleQuickChat(q)}
                className="text-[11px] bg-red-50 hover:bg-red-100 text-[#990012] border border-red-200 rounded-xl py-2 px-2.5 font-bold text-left transition active:scale-95 leading-tight"
              >
                {q}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

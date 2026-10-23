import React from 'react';
import { useSos } from '../../context/SosContext';

export function CalculatorCamouflage() {
  const { calcInput, handleCalcButton } = useSos();

  return (
    <div className="flex-1 bg-neutral-950 text-white flex flex-col justify-end p-5 select-none animate-fadeIn">
      <div className="mb-auto pt-4 flex items-center justify-between text-[11px] text-neutral-600">
        <span>Calculadora Padrão v2.4</span>
        <span className="font-mono text-neutral-500">Digite 911= para voltar</span>
      </div>

      <div className="text-right text-5xl font-light tracking-tight py-6 px-2 overflow-x-auto text-neutral-100">
        {calcInput || '0'}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {['C', '/', '*', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '0'].map((k) => (
          <button
            key={k}
            onClick={() => handleCalcButton(k)}
            className={`h-14 rounded-2xl text-xl font-medium active:scale-95 transition-all shadow ${
              ['/', '*', '-', '+', '='].includes(k)
                ? 'bg-amber-500 text-white hover:bg-amber-400 active:bg-amber-600'
                : k === 'C'
                ? 'bg-neutral-400 text-black hover:bg-neutral-300'
                : 'bg-neutral-800 text-white hover:bg-neutral-700'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

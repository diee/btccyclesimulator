
import React, { useMemo } from 'react';
import { SimulationState, SimulationConfig } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BITCOIN_ORANGE } from '../constants';

interface ResultsScreenProps {
  state: SimulationState;
  config: SimulationConfig;
  onReset: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ state, config, onReset }) => {
  const finalPrice = state.history[state.history.length - 1]?.btcPrice || 0;
  const finalUsd = state.btcAmount * finalPrice;
  const yearsCovered = finalUsd / (state.monthlyExpense * 12);
  
  const chartData = useMemo(() => {
    return state.history.map(h => ({
      name: `C${h.cycle}`,
      valor: h.usdValue,
    }));
  }, [state.history]);

  const resultType = useMemo(() => {
    if (yearsCovered > 25) return { title: 'Libertad Financiera', desc: `Tu stack de BTC cubre más de 25 años de tu estilo de vida (${state.monthlyExpense} USD/mes).`, color: 'text-emerald-400' };
    if (yearsCovered > 10) return { title: 'Respaldo Sólido', desc: 'Tienes una base financiera muy fuerte para la próxima década.', color: 'text-blue-400' };
    if (yearsCovered > 3) return { title: 'Cambio de Vida', desc: 'Has logrado un colchón que te da opciones y tranquilidad.', color: 'text-orange-400' };
    return { title: 'Aprendizaje', desc: 'La simulación terminó. El tiempo es el factor clave en la acumulación.', color: 'text-slate-400' };
  }, [yearsCovered, state.monthlyExpense]);

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <header className="mb-6 text-center">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Resultados Finales</h2>
        <p className="text-3xl font-black text-white">Ciclo Terminado</p>
      </header>

      <div className="bg-slate-800/40 rounded-2xl p-6 mb-6 text-center border border-slate-700">
        <h3 className={`text-xl font-bold mb-2 ${resultType.color}`}>{resultType.title}</h3>
        <p className="text-slate-400 text-sm">{resultType.desc}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">BTC Final</p>
          <p className="text-lg font-bold text-orange-400">{state.btcAmount.toFixed(4)} ₿</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Años Cubiertos</p>
          <p className="text-lg font-bold text-white">{yearsCovered.toFixed(1)}</p>
        </div>
      </div>

      <div className="h-48 mb-8">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-4 px-1">Crecimiento del Portfolio (USD)</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: '#1e293b'}}
              contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px'}}
              labelStyle={{color: '#94a3b8'}}
            />
            <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? BITCOIN_ORANGE : '#475569'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 flex-1 mb-8">
        <div className="flex justify-between text-sm py-2 border-b border-slate-800">
          <span className="text-slate-500">Estilo de Vida</span>
          <span className="font-mono text-blue-400">{config.lifestyle} (${state.monthlyExpense}/mes)</span>
        </div>
        <div className="flex justify-between text-sm py-2 border-b border-slate-800">
          <span className="text-slate-500">Inversión Inicial</span>
          <span className="font-mono">{config.initialBtc} ₿</span>
        </div>
        <div className="flex justify-between text-sm py-2 border-b border-slate-800">
          <span className="text-slate-500">Gastos Realizados</span>
          <span className="text-red-400 font-mono">${state.totalSpentUsd.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm py-2 border-b border-slate-800">
          <span className="text-slate-500">Valor de Mercado Final</span>
          <span className="font-mono text-emerald-400">${finalUsd.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 rounded-2xl font-bold bg-white text-slate-900 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        Nueva Simulación
      </button>
    </div>
  );
};

export default ResultsScreen;

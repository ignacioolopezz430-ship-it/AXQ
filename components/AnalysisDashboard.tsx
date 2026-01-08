
import React from 'react';
import { MarketAnalysis } from '../types';
import { TrendingUp, TrendingDown, Activity, Zap, ShieldAlert, Gauge, AlertTriangle, ExternalLink, RefreshCcw } from 'lucide-react';
import TradeModal from './TradeModal';

interface AnalysisDashboardProps {
  analysis: MarketAnalysis | null;
  loading: boolean;
  assetName: string;
  assetSymbol: string;
  currentPrice: string;
  onRefresh: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, loading, assetName, assetSymbol, currentPrice, onRefresh }) => {
  const [isTradeModalOpen, setIsTradeModalOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="h-full bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center space-y-6 min-h-[500px] backdrop-blur-sm">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={24} />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white mb-2">Analyzing {assetSymbol}...</p>
          <p className="text-gray-500 text-sm">Consulting Force Index & Market Volatility</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const isVolatile = analysis.signals.volatility.toLowerCase().includes('high') || analysis.signals.volatility.toLowerCase().includes('volatile');

  return (
    <>
      <div className="bg-[#111112] rounded-3xl border border-white/10 p-6 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <Activity size={180} />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white">
              <Zap className="text-yellow-400 fill-yellow-400/20" size={20} />
              Forecast AI Engine
            </h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Deep Technical Processing</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${isVolatile ? 'bg-orange-500/10 border-orange-500/50 text-orange-400 animate-pulse' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
            <Gauge size={14} />
            {isVolatile ? 'High Volatility' : 'Stable Market'}
          </div>
        </div>

        {/* PROBABILITY METERS */}
        <div className="mb-8 space-y-4">
          <div className="relative pt-1">
            <div className="flex mb-3 items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-black inline-block py-1 px-3 uppercase rounded-lg text-green-400 bg-green-900/20 border border-green-500/20">
                  Bullish {analysis.bullishProb}%
                </span>
                <span className="text-[10px] text-gray-500 mt-2 font-medium">Price &lt; Force Index</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-xs font-black inline-block py-1 px-3 uppercase rounded-lg text-red-400 bg-red-900/20 border border-red-500/20">
                  Bearish {analysis.bearishProb}%
                </span>
                <span className="text-[10px] text-gray-500 mt-2 font-medium">Price &gt; Force Index</span>
              </div>
            </div>
            <div className="overflow-hidden h-5 mb-4 text-xs flex rounded-xl bg-gray-900 border border-white/10 p-1">
              <div style={{ width: `${analysis.bullishProb}%` }} className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 rounded-l-lg rounded-r-sm"></div>
              <div style={{ width: `${analysis.bearishProb}%` }} className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000 rounded-r-lg rounded-l-sm ml-1"></div>
            </div>
          </div>
        </div>

        {/* LARGE SIGNAL RECOMMENDATION BUTTON */}
        <button 
          onClick={onRefresh}
          className={`w-full mb-8 p-6 rounded-2xl border-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] group/btn text-left relative overflow-hidden ${
            analysis.trend === 'UP' 
              ? 'bg-green-500/5 border-green-500/30 hover:border-green-500 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]' 
              : 'bg-red-500/5 border-red-500/30 hover:border-red-500 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]'
          }`}
        >
          <div className="absolute top-2 right-2 p-2 opacity-20 group-hover/btn:opacity-100 group-hover/btn:rotate-180 transition-all">
            <RefreshCcw size={16} className="text-gray-400" />
          </div>
          
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-xl ${analysis.trend === 'UP' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {analysis.trend === 'UP' ? <TrendingUp size={32} className="text-green-400" /> : <TrendingDown size={32} className="text-red-400" />}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Signal Recommendation</p>
              <h4 className={`text-3xl font-black ${analysis.trend === 'UP' ? 'text-green-400' : 'text-red-400'}`}>
                {analysis.trend === 'UP' ? 'BUY / LONG' : 'SELL / SHORT'}
              </h4>
              <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-1">
                <Activity size={12} className="text-blue-500" />
                Click to re-verify market strength
              </p>
            </div>
          </div>
        </button>

        <div className="space-y-6">
           <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-400 font-medium italic leading-relaxed">
                "{analysis.summary}"
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
             <SignalCard label="RSI" value={analysis.signals.rsi} />
             <SignalCard label="Force Logic" value={analysis.trend === 'UP' ? 'Accumulating' : 'Distributing'} />
             <SignalCard label="Moving Avg" value={analysis.signals.movingAverage} />
             <SignalCard label="Price Action" value={isVolatile ? 'Aggressive' : 'Correction'} />
           </div>

           {analysis.sources && analysis.sources.length > 0 && (
             <div className="pt-4 border-t border-white/5">
               <p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-widest">Grounding Sources</p>
               <div className="flex flex-col gap-2">
                 {analysis.sources.map((source, i) => (
                   <a 
                     key={i} 
                     href={source.uri} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-[10px] text-blue-400/80 hover:text-blue-300 transition-colors flex items-center gap-2 truncate p-2 hover:bg-blue-500/5 rounded-lg border border-transparent hover:border-blue-500/10"
                   >
                     <ExternalLink size={10} />
                     {source.title || 'Market Source'}
                   </a>
                 ))}
               </div>
             </div>
           )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <ShieldAlert size={14} />
              Professional Analysis Mode
            </div>
            <button 
              onClick={() => setIsTradeModalOpen(true)}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-xl transition-all shadow-xl shadow-blue-500/30 active:scale-95"
            >
              EXECUTE TRADE
            </button>
          </div>
          
          <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex gap-3">
            <AlertTriangle className="text-red-500 shrink-0" size={16} />
            <p className="text-[10px] text-gray-500 leading-normal">
              <span className="font-black text-red-500/80 uppercase tracking-tighter mr-1">Aviso de Responsabilidad:</span> 
              AXQ no se hace responsable por ninguna pérdida de capital o dinero real derivada de la ejecución incorrecta de un trade o el uso de estas estimaciones probabilísticas. Opere bajo su propio riesgo.
            </p>
          </div>
        </div>
      </div>

      <TradeModal 
        isOpen={isTradeModalOpen} 
        onClose={() => setIsTradeModalOpen(false)}
        assetName={assetName}
        assetSymbol={assetSymbol}
        price="Live Market"
      />
    </>
  );
};

const SignalCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/[0.08] transition-colors">
    <p className="text-[9px] text-gray-500 uppercase font-black mb-1 tracking-wider">{label}</p>
    <p className="text-xs font-bold text-blue-400 truncate">{value}</p>
  </div>
);

export default AnalysisDashboard;


import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetName: string;
  assetSymbol: string;
  price: string;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, assetName, assetSymbol, price }) => {
  const [step, setStep] = useState<'decision' | 'success'>('decision');
  const [side, setSide] = useState<'BUY' | 'SELL' | null>(null);

  if (!isOpen) return null;

  const handleExecute = (type: 'BUY' | 'SELL') => {
    setSide(type);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade">
      <div className="bg-[#111112] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-zoom">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Execute Trade</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{assetName} • {assetSymbol}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 text-center space-y-6">
          {step === 'decision' ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Current Market Price</p>
                <p className="text-4xl font-black mono text-white">{price}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleExecute('BUY')}
                  className="flex flex-col items-center gap-3 p-6 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all group"
                >
                  <div className="p-3 bg-green-500/20 rounded-full group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-green-400" size={32} />
                  </div>
                  <span className="font-black text-xl text-green-400">BUY</span>
                  <span className="text-[10px] text-green-500/60 uppercase font-bold">Go Long</span>
                </button>

                <button 
                  onClick={() => handleExecute('SELL')}
                  className="flex flex-col items-center gap-3 p-6 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all group"
                >
                  <div className="p-3 bg-red-500/20 rounded-full group-hover:scale-110 transition-transform">
                    <TrendingDown className="text-red-400" size={32} />
                  </div>
                  <span className="font-black text-xl text-red-400">SELL</span>
                  <span className="text-[10px] text-red-500/60 uppercase font-bold">Go Short</span>
                </button>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-3 text-left">
                <AlertTriangle className="text-gray-500 shrink-0" size={16} />
                <p className="text-[9px] text-gray-500 leading-tight italic">
                  No nos hacemos responsables por capital perdido tras la ejecución de este trade simulado o real. El trading es bajo su propia responsabilidad.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4 animate-slide-up">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-blue-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold">Order Confirmed</h4>
                <p className="text-gray-400 px-4">
                  Your {side} order for <span className="text-white font-medium">{assetSymbol}</span> at <span className="text-white font-medium">{price}</span> has been simulated successfully.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-colors"
              >
                DONE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeModal;


import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, LogOut, Send, RefreshCw, Key, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface PendingApprovalProps {
  userName: string;
  requestCode: string;
  onLogout: () => void;
  onActivate: (license: string) => boolean;
  onCheckStatus: () => void;
}

const PendingApproval: React.FC<PendingApprovalProps> = ({ userName, requestCode, onLogout, onActivate, onCheckStatus }) => {
  const [licenseInput, setLicenseInput] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Auto-verificación: Revisa si el admin ya le dio acceso manualmente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      onCheckStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [onCheckStatus]);

  const handleApplyLicense = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onActivate(licenseInput);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  const manualCheck = () => {
    setIsChecking(true);
    onCheckStatus();
    setTimeout(() => setIsChecking(false), 1000);
  };

  const telegramUrl = `https://t.me/incAXQ?text=Hola,%20mi%20ID%20de%20solicitud%20es%20${requestCode}.%20Quisiera%20activar%20mi%20cuenta%20Premium.`;

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[120px] rounded-full" />

      <div className="max-w-md w-full bg-[#111112] border border-white/10 rounded-3xl p-10 shadow-2xl relative z-10 space-y-8 animate-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
              <Clock size={40} className="text-blue-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">¡Hola, {userName}!</h2>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl inline-block">
             <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">ID de Solicitud</p>
             <p className="text-2xl font-black text-blue-400 mono">{requestCode}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-center text-sm leading-relaxed">
            Tu acceso está siendo procesado. El administrador puede activarte <span className="text-green-400 font-bold">manualmente</span> o puedes usar una <span className="text-blue-400 font-bold">Licencia</span>.
          </p>
          
          <button 
            onClick={() => window.open(telegramUrl, '_blank')}
            className="w-full py-4 bg-[#24A1DE] text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#24A1DE]/20 hover:scale-[1.02] active:scale-95"
          >
            <Send size={20} />
            SOLICITAR ACCESO POR TELEGRAM
          </button>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-6">
          <form onSubmit={handleApplyLicense} className="space-y-3">
             <p className="text-[9px] text-center text-gray-500 uppercase tracking-widest font-black">¿Tienes un código de activación?</p>
             <div className="relative">
                <Key className={`absolute left-4 top-4 ${error ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                <input 
                  type="text" 
                  placeholder="Pegar código aquí..." 
                  className={`w-full bg-white/5 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500'} rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none transition-all font-black text-center uppercase tracking-widest`}
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                />
             </div>
             {error && (
               <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 justify-center animate-bounce">
                 <AlertCircle size={12} /> CÓDIGO INVÁLIDO
               </p>
             )}
             <button 
                type="submit"
                className="w-full py-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 font-black rounded-2xl transition-all flex items-center justify-center gap-3"
              >
                <ShieldCheck size={20} />
                ACTIVAR CON CÓDIGO
              </button>
          </form>

          <div className="flex flex-col gap-3">
            <button 
              onClick={manualCheck}
              disabled={isChecking}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/5"
            >
              {isChecking ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Verificar si ya fui aprobado
            </button>
            <button 
              onClick={onLogout}
              className="w-full py-2 text-gray-600 hover:text-gray-400 font-black text-[10px] uppercase tracking-widest transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 opacity-30">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.3em]">
            Sistema AXQ buscando aprobación del Creador...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;

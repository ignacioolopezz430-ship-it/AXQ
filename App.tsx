
import React, { useState, useEffect, useCallback } from 'react';
import { ASSETS } from './constants';
import { Asset, MarketAnalysis, AssetType, UserProfile } from './types';
import MarketSessions from './components/MarketSessions';
import TradingViewChart from './components/TradingViewChart';
import AnalysisDashboard from './components/AnalysisDashboard';
import FinanceChatbot from './components/FinanceChatbot';
import TradingAssistant from './components/TradingAssistant';
import MarketNews from './components/MarketNews';
import PendingApproval from './components/PendingApproval';
import AdminPanel from './components/AdminPanel';
import PriceTicker from './components/PriceTicker';
import UserDropdown from './components/UserDropdown';
import { getMarketAnalysis } from './services/geminiService';
import { LayoutGrid, TrendingUp, BarChart3, Globe, ShieldCheck, User, Mail, Lock, ChevronRight, Newspaper, Crown, Fingerprint } from 'lucide-react';

type AppState = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'NEWS' | 'PENDING' | 'ADMIN';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [assetList] = useState<Asset[]>(ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMasterMode, setIsMasterMode] = useState(false);

  const DB_KEY = 'axq_users_db';
  const SESSION_KEY = 'axq_current_session';
  const MASTER_LICENSE_KEY = 'axq_master_license';

  const checkStatus = useCallback(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');

      if (savedSession) {
        const sessionUser = JSON.parse(savedSession) as UserProfile;
        const freshUser = db.find((u: any) => u.email === sessionUser.email);
        
        if (freshUser) {
          setCurrentUser(freshUser);
          if (freshUser.status === 'admin') {
            setAppState('ADMIN');
          } else if (freshUser.status === 'approved') {
            setAppState('DASHBOARD');
          } else {
            setAppState('PENDING');
          }
        } else {
          handleLogout();
        }
      }
    } catch (e) {
      console.error("Error checking session status:", e);
      handleLogout();
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    
    if (mode === 'master') {
      setIsMasterMode(true);
      setAppState('AUTH');
    } else if (mode === 'join') {
      setAppState('AUTH');
    }
    
    if (!localStorage.getItem(MASTER_LICENSE_KEY)) {
      localStorage.setItem(MASTER_LICENSE_KEY, 'AXQ-GOLD-2025');
    }
    
    checkStatus();
  }, [checkStatus]);

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setIsMasterMode(false);
    setAnalysis(null);
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    setAppState('LANDING');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (password === 'axqadmin777') {
      const creatorUser: UserProfile = {
        id: 'master_root',
        name: name || 'Creador AXQ',
        email,
        status: 'admin',
        joinedAt: new Date().toISOString(),
        requestCode: 'MASTER'
      };
      const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
      const filteredDb = db.filter((u: any) => u.email !== email);
      filteredDb.push(creatorUser);
      localStorage.setItem(DB_KEY, JSON.stringify(filteredDb));
      localStorage.setItem(SESSION_KEY, JSON.stringify(creatorUser));
      setCurrentUser(creatorUser);
      setAppState('ADMIN');
      return;
    }

    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const existingUser = db.find((u: any) => u.email === email);

    if (existingUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(existingUser));
      checkStatus();
      return;
    }

    const newUser: UserProfile = {
      id: Date.now().toString(),
      name,
      email,
      status: 'pending',
      joinedAt: new Date().toISOString(),
      requestCode: 'AXQ-' + Math.floor(1000 + Math.random() * 9000)
    };

    db.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    checkStatus();
  };

  const handleActivateWithLicense = (license: string) => {
    const validLicense = localStorage.getItem(MASTER_LICENSE_KEY);
    if (license.trim().toUpperCase() === validLicense?.toUpperCase() && currentUser) {
      const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
      const updatedDb = db.map((u: any) => u.email === currentUser.email ? { ...u, status: 'approved' } : u);
      localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));
      const updatedUser = { ...currentUser, status: 'approved' as const };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setAppState('DASHBOARD');
      return true;
    }
    return false;
  };

  const performAnalysis = useCallback(async (asset: Asset) => {
    if (!currentUser) return;
    setIsAnalyzing(true);
    try {
      const result = await getMarketAnalysis(asset.symbol);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (appState === 'DASHBOARD' && currentUser) {
      performAnalysis(selectedAsset);
    }
  }, [selectedAsset, appState, performAnalysis, currentUser]);

  if (appState === 'LANDING') {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full z-0" />
        <div className="max-w-4xl w-full text-center space-y-8 relative z-10 animate-slide-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wider uppercase">
              <Globe size={16} /> AXQ Global Trading
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 select-none">
              AXQ
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">Análisis de trading en tiempo real potenciado por IA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <FeatureCard icon={<TrendingUp className="text-green-400" />} title="Datos Reales" description="Conexión directa con mercados globales sin retraso." />
            <FeatureCard icon={<BarChart3 className="text-blue-400" />} title="Análisis Smart" description="Modelos de probabilidad avanzados basados en tendencia." />
            <FeatureCard icon={<ShieldCheck className="text-purple-400" />} title="Acceso Seguro" description="Infraestructura profesional para traders globales." />
          </div>
          <button onClick={() => setAppState('AUTH')} className="group relative px-12 py-5 bg-white text-black font-black text-xl rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 shadow-2xl shadow-white/10">START TRADING</button>
        </div>
      </div>
    );
  }

  if (appState === 'AUTH') {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden animate-fade">
        {isMasterMode && (
          <>
            <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />
            <div className="absolute top-10 left-10 flex items-center gap-2 text-blue-500/50 font-black text-[10px] tracking-[0.5em] uppercase">
              <Fingerprint size={16} /> Secure Creator Line Active
            </div>
          </>
        )}
        <div className={`w-full max-w-md bg-[#111112] border ${isMasterMode ? 'border-blue-500/30' : 'border-white/10'} rounded-3xl p-10 shadow-2xl animate-zoom relative z-10`}>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${isMasterMode ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
              {isMasterMode ? <ShieldCheck size={12}/> : <User size={12}/>}
              {isMasterMode ? 'Master Portal' : 'User Portal'}
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-2 text-white">AXQ Portal</h2>
            <p className="text-gray-500 text-sm font-medium italic">
              {isMasterMode ? 'Bienvenido de vuelta, Señor.' : 'Solo para miembros verificados.'}
            </p>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-4 text-gray-500" size={18} />
                <input required name="name" type="text" placeholder="Nombre completo" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-medium" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-gray-500" size={18} />
                <input required name="email" type="email" placeholder="Correo electrónico" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-medium" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-500" size={18} />
                <input required name="password" type="password" placeholder={isMasterMode ? "Clave Maestra" : "Contraseña secreta"} className={`w-full bg-white/5 border ${isMasterMode ? 'border-blue-500/30' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-medium`} />
              </div>
            </div>
            <button type="submit" className={`w-full py-5 ${isMasterMode ? 'bg-blue-700 hover:bg-blue-600 shadow-blue-700/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'} text-white font-black rounded-xl transition-all flex items-center justify-center gap-3 group shadow-xl`}>
              {isMasterMode ? 'DESBLOQUEAR SISTEMA' : 'ENTRAR AL SISTEMA'} 
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <button onClick={handleLogout} className="w-full mt-6 text-xs text-gray-600 hover:text-gray-400 font-bold uppercase tracking-widest">Volver al inicio</button>
        </div>
      </div>
    );
  }

  if (appState === 'PENDING' && currentUser) {
    return (
      <PendingApproval 
        userName={currentUser.name} 
        requestCode={currentUser.requestCode || 'N/A'}
        onLogout={handleLogout} 
        onActivate={handleActivateWithLicense}
        onCheckStatus={checkStatus}
      />
    );
  }

  if (appState === 'ADMIN' && currentUser?.status === 'admin') {
    return <AdminPanel onBack={() => setAppState('DASHBOARD')} />;
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 animate-fade">
      <nav className="sticky top-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-3">
               <h1 className="text-2xl font-black tracking-tighter">AXQ</h1>
               {currentUser?.status === 'admin' && (
                 <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                   <Crown size={12} /> MASTER
                 </span>
               )}
            </div>
            <MarketSessions />
          </div>
          <div className="flex items-center gap-6 w-full xl:w-auto justify-end">
            {currentUser?.status === 'admin' && (
              <button 
                onClick={() => setAppState('ADMIN')} 
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-purple-600/20"
              >
                <ShieldCheck size={16}/> CONTROL DE CLIENTES
              </button>
            )}
            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 shadow-lg">
              <button onClick={() => setAppState('DASHBOARD')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all ${appState === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}><LayoutGrid size={18} /> ANÁLISIS</button>
              <button onClick={() => setAppState('NEWS')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all ${appState === 'NEWS' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}><Newspaper size={18} /> NOTICIAS</button>
            </div>
            
            <UserDropdown user={currentUser} onLogout={handleLogout} />
          </div>
        </div>
      </nav>
      <main className="max-w-[1600px] mx-auto p-4 lg:p-8">
        {appState === 'DASHBOARD' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-[#111112] rounded-3xl border border-white/10 shadow-xl overflow-hidden animate-slide-up">
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl border border-white/10">{selectedAsset.icon}</div>
                    <div><h2 className="text-2xl font-bold tracking-tight">{selectedAsset.name}</h2><p className="text-sm text-blue-500 font-mono tracking-wider font-bold">{selectedAsset.symbol}</p></div>
                  </div>
                  <div className="w-full md:w-[300px]"><PriceTicker symbol={selectedAsset.symbol} /></div>
                </div>
                <div className="p-2"><TradingViewChart symbol={selectedAsset.symbol} /></div>
              </div>
              <TradingAssistant assetSymbol={selectedAsset.symbol} />
            </div>
            <div className="lg:col-span-4 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <AnalysisDashboard analysis={analysis} loading={isAnalyzing} assetName={selectedAsset.name} assetSymbol={selectedAsset.symbol} currentPrice="Market" onRefresh={() => performAnalysis(selectedAsset)} />
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6 relative overflow-hidden shadow-xl"><h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><LayoutGrid size={16} /> Activos Premium</h4><div className="grid grid-cols-2 gap-2">{assetList.map(asset => (<button key={asset.id} onClick={() => setSelectedAsset(asset)} className={`p-3 rounded-xl text-xs font-bold transition-all border ${selectedAsset.id === asset.id ? 'bg-blue-600/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}>{asset.name}</button>))}</div></div>
            </div>
          </div>
        ) : (
          <MarketNews onTriggerAdmin={() => setAppState('ADMIN')} />
        )}
      </main>
      <FinanceChatbot />
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
    <div className="mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

export default App;

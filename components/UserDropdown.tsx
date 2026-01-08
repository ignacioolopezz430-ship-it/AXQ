
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, LogOut, Shield, Mail, Calendar, ChevronDown, IdCard, ExternalLink } from 'lucide-react';

interface UserDropdownProps {
  user: UserProfile;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = () => {
    if (user.status === 'admin') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    if (user.status === 'approved') return 'text-green-400 bg-green-400/10 border-green-400/20';
    return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-black text-white truncate max-w-[120px]">{user.name}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Miembro {user.status}</p>
        </div>
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-[#111112] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100] backdrop-blur-xl">
          {/* Header del Perfil */}
          <div className="p-6 bg-white/[0.02] border-b border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-black text-white shadow-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-black text-white tracking-tighter leading-tight">{user.name}</h4>
                <div className={`mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor()}`}>
                  <Shield size={10} />
                  {user.status}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                <Mail size={12} className="text-blue-500" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                <Calendar size={12} className="text-blue-500" />
                Unido el {new Date(user.joinedAt).toLocaleDateString()}
              </div>
              {user.requestCode && (
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                  <IdCard size={12} className="text-blue-500" />
                  ID: <span className="mono text-blue-400">{user.requestCode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="p-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
              <div className="p-2 bg-white/5 rounded-xl group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                <User size={18} />
              </div>
              Configuración de Perfil
              <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group mt-1"
            >
              <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                <LogOut size={18} />
              </div>
              Cerrar Sesión
            </button>
          </div>

          <div className="p-4 bg-black/40 text-center">
             <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.3em]">AXQ Secure Terminal v4.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

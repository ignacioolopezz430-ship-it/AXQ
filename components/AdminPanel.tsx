import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, UserCheck, Trash2, ArrowLeft, Users, Search, CheckCircle2, Crown, Key, UserPlus } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Sistema Actualizado');
  const [masterLicense, setMasterLicense] = useState(localStorage.getItem('axq_master_license') || 'AXQ-GOLD-2025');

  const loadUsers = () => {
    const saved = localStorage.getItem('axq_users_db');
    if (saved) setUsers(JSON.parse(saved));
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateStatus = (userId: string, status: UserProfile['status']) => {
    const updated = users.map(u => u.id === userId ? { ...u, status } : u);
    setUsers(updated);
    localStorage.setItem('axq_users_db', JSON.stringify(updated));
    if (status === 'approved' || status === 'admin') {
      triggerToast('Acceso concedido al cliente');
    }
  };

  const saveLicense = () => {
    localStorage.setItem('axq_master_license', masterLicense.toUpperCase());
    triggerToast('Nueva Licencia Maestra guardada');
  };

  const deleteUser = (userId: string) => {
    if (!confirm('¿Eliminar este usuario del sistema definitivamente?')) return;
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    localStorage.setItem('axq_users_db', JSON.stringify(updated));
    triggerToast('Usuario eliminado');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.requestCode && u.requestCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] p-6 lg:p-12 animate-in fade-in duration-500">
      {showToast && (
        <div className="fixed top-10 right-10 z-[200] bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300">
          <CheckCircle2 size={24} />
          <p className="font-bold">{toastMsg}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-600/20 rounded-3xl border border-blue-500/20">
              <ShieldCheck className="text-blue-500" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Panel de Creador</h1>
              <p className="text-gray-500 font-medium">Control exclusivo de acceso AXQ</p>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-white flex items-center gap-2"
          >
            <ArrowLeft size={18} /> SALIR DEL PANEL
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#111112] border border-white/10 p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-2">
              <Key className="text-yellow-500" size={20} />
              <h3 className="font-black text-white uppercase tracking-widest text-sm">Llave Maestra de Activación</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-black tracking-widest focus:outline-none focus:border-blue-500 transition-all uppercase"
                value={masterLicense}
                placeholder="EJ: AXQ-PRO-2025"
                onChange={(e) => setMasterLicense(e.target.value.toUpperCase())}
              />
              <button 
                onClick={saveLicense}
                className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all"
              >
                ACTUALIZAR LLAVE
              </button>
            </div>
            <p className="text-xs text-gray-600">Este código permite la auto-activación de clientes sin intervención manual.</p>
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#111112] border border-white/10 p-6 rounded-3xl flex-1 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Users /></div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase">Total Clientes</p>
                <p className="text-3xl font-black text-white">{users.length}</p>
              </div>
            </div>
            <div className="bg-[#111112] border border-white/10 p-6 rounded-3xl flex-1 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 text-green-400 rounded-xl"><UserCheck /></div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase">Activos</p>
                <p className="text-3xl font-black text-white">{users.filter(u => u.status === 'approved').length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111112] border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Administración de Clientes</h3>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  <th className="pb-4 px-4">Usuario</th>
                  <th className="pb-4 px-4">Estado</th>
                  <th className="pb-4 px-4">ID Solicitud</th>
                  <th className="pb-4 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-gray-600 italic">No hay clientes en la base de datos.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          user.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                          user.status === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                          'bg-orange-500/10 text-orange-400'
                        }`}>
                          {user.status === 'approved' ? 'ACCESO TOTAL' : user.status === 'admin' ? 'CREADOR' : 'PENDIENTE'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-xs font-mono text-blue-400 font-bold bg-blue-400/5 px-2 py-1 rounded">
                          {user.requestCode || '---'}
                        </code>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.status === 'pending' && (
                            <button 
                              onClick={() => updateStatus(user.id, 'approved')}
                              className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all border border-green-500/20"
                              title="Aprobar Acceso"
                            >
                              <UserPlus size={18} />
                            </button>
                          )}
                          {user.status !== 'admin' && (
                            <button 
                              onClick={() => deleteUser(user.id)}
                              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/20"
                              title="Eliminar del Sistema"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
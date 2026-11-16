import React, { useState, useEffect } from 'react';

export default function Header({ 
  currentUser, 
  setIsMobileOpen 
}) {
  const [liveDateTime, setLiveDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const optionsDate = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
      const dateStr = now.toLocaleDateString('tr-TR', optionsDate);
      const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLiveDateTime(`${dateStr} • ${timeStr}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 px-4 md:px-8 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobil Hamburger Butonu */}
        <button 
          onClick={() => setIsMobileOpen(prev => !prev)}
          type="button" 
          aria-label="Menüyü aç"
          className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        
        <h1 className="font-headline font-bold text-sm md:text-base text-white truncate">
          YEMTAL Yönetim &amp; Otomasyon Paneli
        </h1>
        <span className="hidden lg:inline text-slate-700">|</span>
        
        {/* Canlı Tarih ve Saat Göstergesi */}
        <div className="hidden lg:flex items-center gap-2 text-slate-300 text-xs font-mono bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
          <span className="material-symbols-outlined text-[15px] text-teal animate-pulse">schedule</span>
          <span>{liveDateTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobil Canlı Saat Göstergesi */}
        <div className="flex lg:hidden items-center gap-1.5 text-slate-400 text-[11px] font-mono">
          <span className="material-symbols-outlined text-[14px] text-teal">schedule</span>
          <span>{liveDateTime.split('•')[1] || ''}</span>
        </div>

        {/* SAĞ ÜST: Giriş: Kim Olduğu Yazısı */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 shadow-xs">
          <span className="text-xs font-medium text-slate-400">Giriş:</span>
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className={`w-2 h-2 rounded-full ${
              currentUser?.role === 'admin' ? 'bg-amber-400' :
              currentUser?.role === 'principal' ? 'bg-blue-400' :
              currentUser?.role === 'vice_principal' ? 'bg-indigo-400' : 'bg-emerald-400'
            }`}></span>
            <span className="text-white">{currentUser?.name}</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded ${
              currentUser?.role === 'admin' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              currentUser?.role === 'principal' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
              currentUser?.role === 'vice_principal' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
              'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              ({currentUser?.roleLabel})
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

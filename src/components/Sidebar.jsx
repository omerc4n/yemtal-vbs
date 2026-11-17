import React from 'react';

export default function Sidebar({
  currentTab,
  setCurrentTab,
  smsBalance,
  currentUser,
  pendingStagingCount = 0,
  lastSyncInfo,
  isMobileOpen,
  setIsMobileOpen
}) {
  return (
    <>
      {/* Mobil Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-80 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out shadow-lg md:shadow-none ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>

        {/* Üst Alan */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-85px)]">

          {/* Logo & Kurum Başlığı */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline font-bold text-lg text-white tracking-tight">YEMTAL-VBS</span>
              <span className="font-body text-xs text-slate-400 truncate">Veli Bilgilendirme Sistemi</span>
            </div>
          </div>

          {/* Rozet Durum Paneli */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-blue-950/40 border border-blue-900 text-blue-300">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">account_balance</span>
                <span className="text-xs font-medium">Kurum Kodu:</span>
              </div>
              <span className="font-code text-xs font-bold">YEMTAL-01</span>
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-emerald-950/40 border border-emerald-800 text-emerald-300">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald">sms</span>
                <span className="text-xs font-medium">Netgsm SMS:</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-code text-xs font-bold tabular-nums">{smsBalance.toLocaleString('tr-TR')}</span>
                <span className="text-[11px] opacity-80">Adet</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-teal-950/40 border border-teal-800 text-teal-300">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-teal">extension</span>
                <span className="text-xs font-medium">e-Okul Eklentisi:</span>
              </div>
              <span className="font-code text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
                Aktif
              </span>
            </div>
          </div>

          {/* Menü Linkleri */}
          <nav aria-label="Ana Menü" className="flex flex-col gap-3 pt-1">

            {/* Genel Bakış */}
            <button
              type="button"
              onClick={() => { setCurrentTab('dashboard'); setIsMobileOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-title text-xs font-semibold transition-all ${currentTab === 'dashboard'
                ? 'bg-blue-950/70 text-blue-300 border-l-4 border-blue-500 shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/80'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Genel Bakış</span>
            </button>

            {/* OTOMASYON İŞLEMLERİ */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between px-2 mb-1">
                <span className="text-[11px] text-teal-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal"></span>
                  Otomasyon İşlemleri
                </span>
                <span className="text-[10px] font-semibold bg-teal-900 text-teal-300 px-1.5 py-0.5 rounded border border-teal-700">Robotik</span>
              </div>

              {/* Otomasyon Öğrenci (e-Okul Devamsızlık Masası) */}
              <button
                type="button"
                onClick={() => { setCurrentTab('automation_students'); setIsMobileOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-title text-xs transition-all ${currentTab === 'automation_students'
                  ? 'bg-blue-950/70 text-blue-300 border-l-4 border-blue-500 font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-400 text-[19px]">smart_toy</span>
                  <span>Otomasyon Öğrenci</span>
                </div>
                {pendingStagingCount > 0 ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    {pendingStagingCount} Bekleyen
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">e-Okul</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setCurrentTab('sync'); setIsMobileOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-title text-xs transition-all ${currentTab === 'sync'
                  ? 'bg-blue-950/70 text-blue-300 border-l-4 border-blue-500 font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-400 text-[19px]">cloud_download</span>
                  <span>e-Okul Veri Çekme</span>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">sync</span>
              </button>
            </div>

            {/* MANUEL İŞLEMLER */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 font-bold tracking-wider uppercase px-2 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                Manuel İşlemler &amp; Rehber
              </span>

              <button
                type="button"
                onClick={() => { setCurrentTab('send_sms'); setIsMobileOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-title text-xs transition-all ${currentTab === 'send_sms'
                  ? 'bg-blue-950/70 text-blue-300 border-l-4 border-blue-500 font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
              >
                <span className="material-symbols-outlined text-[19px] text-blue-400">chat</span>
                <span>Mesaj Gönderim Merkezi</span>
              </button>

              <button
                type="button"
                onClick={() => { setCurrentTab('directory'); setIsMobileOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-title text-xs transition-all ${currentTab === 'directory'
                  ? 'bg-blue-950/70 text-blue-300 border-l-4 border-blue-500 font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-slate-400 text-[19px]">contacts</span>
                  <span>Rehberim (Öğrenci &amp; Veli)</span>
                </div>
                <span className="font-code text-xs text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">840</span>
              </button>
            </div>

            {/* RAPORLAR & DENETİM GÜNLÜĞÜ */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 font-bold tracking-wider uppercase px-2 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                Denetim &amp; Raporlar
              </span>

              <button
                type="button"
                onClick={() => { setCurrentTab('reports'); setIsMobileOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-title text-xs transition-all ${currentTab === 'reports'
                  ? 'bg-blue-950/70 text-blue-300 border-l-4 border-blue-500 font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-indigo-400 text-[19px]">history_edu</span>
                  <span className="font-semibold">Kullanıcı İşlem Raporları</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">Log</span>
              </button>
            </div>

            {/* NETGSM & SİSTEM AYARLARI */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 font-bold tracking-wider uppercase px-2 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                Sistem &amp; Yetki
              </span>

              <button
                type="button"
                onClick={() => { setCurrentTab('settings'); setIsMobileOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-title text-xs transition-all ${currentTab === 'settings'
                  ? 'bg-blue-950/70 text-blue-300 border-l-4 border-blue-500 font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-slate-400 text-[19px]">tune</span>
                  <span>Netgsm &amp; Sistem Ayarları</span>
                </div>
                {currentUser?.role === 'admin' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">Admin</span>
                )}
              </button>
            </div>

          </nav>
        </div>

        {/* Alt Profil: Kullanıcı Değiştirme KUTUSU KALDIRILDI! Sadece kimin oturumda olduğu gösterilir. */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentUser?.role === 'admin' ? 'bg-navy text-white shadow-xs border border-blue-600' : 'bg-slate-800 text-slate-200'
              }`}>
              {currentUser?.avatar || 'AD'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-white truncate font-bold">
                {currentUser?.name}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {currentUser?.roleLabel}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900 font-semibold">
            Çevrim İçi
          </span>
        </div>

      </aside>
    </>
  );
}

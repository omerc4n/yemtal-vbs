import React from 'react';

export default function DashboardView({ 
  setCurrentTab, 
  pendingStagingCount, 
  smsBalance,
  currentUser,
  lastSyncInfo,
  showToast 
}) {
  return (
    <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fadeIn">
      
      {/* Üst Hoş Geldiniz Başlığı */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800 gap-3">
        <div>
          <h2 className="font-headline font-bold text-xl text-white tracking-tight">
            YEMTAL Yönetim ve Bilgilendirme Merkezi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hoş geldiniz, <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.roleLabel}). Günlük okul devamsızlık ve SMS operasyonları özeti.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => setCurrentTab('automation_students')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px]">smart_toy</span>
            <span>Otomasyon Öğrenci (SMS)</span>
          </button>

          <button 
            type="button" 
            onClick={() => setCurrentTab('send_sms')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy text-white rounded-lg text-xs font-bold hover:bg-blue-900 transition-all shadow-xs border border-blue-700"
          >
            <span className="material-symbols-outlined text-[17px]">chat</span>
            <span>Manuel SMS</span>
          </button>
        </div>
      </div>

      {/* 4 Önemli KPI Metrik Kartı (Karanlık Tema) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metrik 1: Toplam Öğrenci */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kayıtlı Öğrenci</span>
            <div className="w-9 h-9 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-900/60 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>
          <div>
            <div className="font-headline font-bold text-3xl text-white tracking-tight">840</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Tüm şubeler e-Okul eşleşmeli</span>
          </div>
        </div>

        {/* Metrik 2: Kayıtlı Veli Numarası */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kayıtlı Veli</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-900/60 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">contact_phone</span>
            </div>
          </div>
          <div>
            <div className="font-headline font-bold text-3xl text-emerald-400 tracking-tight">832</div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">%99.0 İletişim Erişimi</span>
          </div>
        </div>

        {/* Metrik 3: Bugün Devamsız Öğrenci */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Bugün Devamsız</span>
            <div className="w-9 h-9 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-900/60 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person_off</span>
            </div>
          </div>
          <div>
            <div className="font-headline font-bold text-3xl text-amber-400 tracking-tight">
              {pendingStagingCount}
            </div>
            <span className="text-[11px] text-amber-300 font-medium mt-1 block">
              {pendingStagingCount > 0 ? 'SMS gönderimi bekliyor' : 'Tüm velilere iletildi'}
            </span>
          </div>
        </div>

        {/* Metrik 4: Netgsm SMS Bakiyesi */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Netgsm Bakiye</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-900/60 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">sms</span>
            </div>
          </div>
          <div>
            <div className="font-headline font-bold text-3xl text-white tracking-tight tabular-nums">
              {smsBalance.toLocaleString('tr-TR')}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Başlık: <strong>YEMTAL</strong></span>
          </div>
        </div>

      </div>

      {/* Devamsızlık Hızlı Aksiyon Banner'ı */}
      <section className="rounded-xl border border-emerald-800/80 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[28px]">bolt</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-headline font-bold text-base md:text-lg text-white">
                Günlük Devamsızlık Bildirim Otomasyonu
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                18 Öğrenci Bekliyor
              </span>
            </div>
            <p className="text-sm text-slate-300">
              Bugün e-Okul sisteminden çekilen 18 devamsız öğrenci için veli bilgilendirme SMS'leri hazır. Tek tıkla onaylayıp velilere gönderebilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <button 
            type="button"
            onClick={() => setCurrentTab('automation_students')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald text-white rounded-lg text-xs font-bold shadow-xs hover:bg-emerald-600 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            <span>Otomasyon Öğrenci Masasına Git</span>
          </button>
        </div>
      </section>

      {/* İki Kolonlu Detay Kartları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sol Kolon: Rehber Detayları & Eksikler */}
        <article className="bg-[#0F172A] rounded-xl border border-slate-800 shadow-xs p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-blue-400 text-[20px]">contacts</span>
                <h3 className="font-title text-sm font-bold text-white">Rehber İletişim Havuzu &amp; Eksikler</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">840 Toplam Kayıt</span>
            </div>

            <p className="text-xs text-slate-300">
              Sistemde kayıtlı öğrencilerin veli telefon numaraları kontrol edilmektedir. İletişim eksikliklerini buradan tespit edebilirsiniz.
            </p>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-[18px]">phone_disabled</span>
                  <span className="font-semibold text-red-200">Telefon Numarası Olmayan Kayıt:</span>
                </div>
                <span className="font-code font-bold text-red-400 text-sm">8 Öğrenci</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">group_add</span>
                  <span className="text-slate-300">2. Veli (Yedek) Numarası Eksik:</span>
                </div>
                <span className="font-code font-bold text-slate-400">45 Öğrenci</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setCurrentTab('directory')}
              className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-md hover:bg-blue-900 transition-all"
            >
              Tüm Rehberi Görüntüle
            </button>
            <button 
              type="button"
              onClick={() => setCurrentTab('directory')}
              className="px-4 py-2 border border-slate-700 text-slate-300 text-xs font-bold rounded-md hover:bg-slate-800 transition-all"
            >
              Eksik Numaraları Tamamla (8)
            </button>
          </div>
        </article>

        {/* Sağ Kolon: Sistem & Yetki Bilgisi */}
        <article className="bg-[#0F172A] rounded-xl border border-slate-800 shadow-xs p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-teal text-[20px]">admin_panel_settings</span>
                <h3 className="font-title text-sm font-bold text-white">Kurum &amp; Netgsm Altyapısı</h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">Aktif</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Resmi Okul Adı:</span>
                <span className="font-semibold text-white">Yunus Emre Mesleki ve Teknik Anadolu Lisesi</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Kurum Kodu:</span>
                <span className="font-mono font-bold text-white">YEMTAL-01</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">SMS Gönderici Başlığı:</span>
                <span className="font-bold text-teal">YEMTAL (Onaylı)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Son e-Okul Çekimi:</span>
                <span className="font-mono text-emerald-400 font-semibold">{lastSyncInfo?.time || '16.11.2026 21:30'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Veriyi Çeken Yetkili:</span>
                <span className="font-bold text-amber-300">{lastSyncInfo?.user || 'Admin (Admin)'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Kullanıcı Rolünüz:</span>
                <span className="font-bold text-amber-300">{currentUser?.roleLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button 
              type="button"
              onClick={() => setCurrentTab('settings')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
            >
              <span>Netgsm ve Yetki Ayarlarına Git</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </article>

      </div>

    </div>
  );
}

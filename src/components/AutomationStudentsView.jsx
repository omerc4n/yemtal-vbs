import React, { useState } from 'react';

export default function AutomationStudentsView({
  stagingList,
  onSendSingleSms,
  onSendBulkSms,
  onRefreshEOkulData,
  isRefreshing,
  smsBalance,
  lastSyncInfo,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'Tam Gün Yok', 'Öğleden Önce Yok', 'Öğleden Sonra Yok'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'sent'
  const [selectedIds, setSelectedIds] = useState([]);

  // Şablon Mesaj State'leri
  const DEFAULT_TEMPLATE = "Sayın Velimiz, [Sinif] sınıfı [Okul_No] numaralı öğrencimiz [Ogrenci_Adi], [Tarih] tarihinde '[Devamsizlik_Turu]' olarak e-Okul sistemine kaydedilmiştir. Bilgilerinize rica ederiz. YEMTAL İdaresi";
  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_TEMPLATE);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(true);

  // Modallar
  const [previewItem, setPreviewItem] = useState(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Şablon Mesaj Üretici (Dinamik Değişkenleri Çözer)
  const generateMessageText = (item) => {
    if (!item) return '';
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
    
    let text = messageTemplate;
    text = text.replace(/\[ogrenci_adi\]|\{ogrenci_adi\}|\[öğrenci adı\]|\[ogrenci adı\]|\[öğrenci_adı\]/gi, item.name || '');
    text = text.replace(/\[okul_no\]|\{okul_no\}|\[okul no\]|\[okulno\]/gi, item.schoolNo || '');
    text = text.replace(/\[sinif\]|\{sinif\}|\[sınıf\]/gi, item.class || '');
    text = text.replace(/\[devamsizlik_turu\]|\{devamsizlik_turu\}|\[devamsızlık türü\]|\[devamsizlik türü\]/gi, item.attendanceType || '');
    text = text.replace(/\[tarih\]|\{tarih\}/gi, dateStr);
    text = text.replace(/\[veli_adi\]|\{veli_adi\}|\[veli adı\]/gi, item.parentName ? item.parentName.split('(')[0].trim() : 'Velimiz');
    text = text.replace(/\[kurum_adi\]|\{kurum_adi\}|\[kurum adı\]/gi, 'YEMTAL İdaresi');
    return text;
  };

  const handleInsertTag = (tag) => {
    setMessageTemplate(prev => prev + (prev.endsWith(' ') ? '' : ' ') + tag);
    if (showToast) showToast(`${tag} etiketi şablona eklendi.`, 'info');
  };

  const sampleStudent = stagingList[0] || {
    name: 'Deniz Sarp Karaca',
    schoolNo: '1055',
    class: '10-A',
    attendanceType: 'Öğleden Önce Yok',
    parentName: 'Metin Karaca (Baba)',
    parentPhone: '0533 111 22 44'
  };

  // Filtreleme
  const filteredList = stagingList.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.schoolNo.includes(searchTerm) ||
      item.class.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' ? true : item.attendanceType === typeFilter;
    const matchesStatus = statusFilter === 'all' ? true : item.smsStatus === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // İstatistikler
  const totalCount = stagingList.length;
  const fullDayCount = stagingList.filter(i => i.attendanceType === 'Tam Gün Yok').length;
  const morningCount = stagingList.filter(i => i.attendanceType === 'Öğleden Önce Yok').length;
  const afternoonCount = stagingList.filter(i => i.attendanceType === 'Öğleden Sonra Yok').length;
  const pendingSmsCount = stagingList.filter(i => i.smsStatus === 'pending').length;
  const sentSmsCount = stagingList.filter(i => i.smsStatus === 'sent').length;

  // Seçim işlemleri
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pendingIds = filteredList.filter(i => i.smsStatus === 'pending').map(i => i.id);
      setSelectedIds(pendingIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Tekli Mesaj Gönderim Tetikleyici
  const handleConfirmSingleSend = () => {
    if (!previewItem) return;
    onSendSingleSms(previewItem);
    setPreviewItem(null);
  };

  // Toplu Mesaj Gönderim Tetikleyici
  const handleConfirmBulkSend = () => {
    const idsToSend = selectedIds.length > 0 ? selectedIds : stagingList.filter(i => i.smsStatus === 'pending').map(i => i.id);
    if (idsToSend.length === 0) return;
    onSendBulkSms(idsToSend);
    setSelectedIds([]);
    setIsBulkModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fadeIn">
      
      {/* 1. ÜST BAŞLIK & ANA AKSİYONLAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-950/70 border border-teal-800 text-teal-400 flex items-center justify-center shadow-xs flex-shrink-0">
            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-headline font-bold text-xl text-white tracking-tight">
                Otomasyon Öğrenci (e-Okul Devamsızlık Masası)
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
                Chrome Eklentisi Canlı
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Chrome eklentisiyle e-Okul'dan çekilen devamsızlıklar (Öğleden Önce Yok, Öğleden Sonra Yok, Tam Gün Yok). Tekli veya toplu mesaj gönderin.
            </p>
          </div>
        </div>

        {/* Eylem Butonları: Şablon Düzenle, e-Okul Veri Yenile & Toplu Mesaj Gönder */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* SMS ŞABLON DÜZENLEME BUTONU */}
          <button 
            type="button"
            onClick={() => setIsTemplateEditorOpen(prev => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold border shadow-xs transition-all active:scale-95 ${
              isTemplateEditorOpen 
                ? 'bg-teal-950 text-teal-300 border-teal-700' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-teal">edit_note</span>
            <span>{isTemplateEditorOpen ? 'Şablonu Gizle' : 'SMS Şablonu Ayarla'}</span>
          </button>

          {/* e-OKUL VERİ YENİLE BUTONU */}
          <button 
            type="button"
            onClick={onRefreshEOkulData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-700 text-blue-200 rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isRefreshing ? 'e-Okul Taranıyor...' : 'e-Okul Veri Yenile'}</span>
          </button>

          {/* TOPLU MESAJ GÖNDER BUTONU */}
          <button 
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            disabled={pendingSmsCount === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>
              {selectedIds.length > 0 
                ? `Seçilenlere Mesaj Gönder (${selectedIds.length})` 
                : `Tümüne Mesaj Gönder (${pendingSmsCount})`
              }
            </span>
          </button>
        </div>
      </div>

      {/* 2. EKLENTİ ENTEGRASYON BARI (VERİLER OTOMATİK DÜŞER) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#0F172A] border border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Sol: Eklenti Durumu & Son Çekilme Detayları */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">extension</span>
            </div>
            <div className="flex flex-col text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">e-Okul Chrome Köprüsü:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span> Veri Almaya Hazır
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                Eklentiden devamsızlık çekildiğinde otomatik bu listeye işlenir.
              </span>
            </div>
          </div>

          {/* En Son Ne Zaman Veri Çekildi & Hangi Kullanıcıdan Geldiği */}
          {lastSyncInfo && (
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 sm:pl-3 sm:border-l sm:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800">
                <span className="material-symbols-outlined text-[15px] text-teal">update</span>
                <span className="text-slate-400 text-[11px]">Son Çekilme:</span>
                <span className="font-mono text-emerald-400 font-bold text-[11px]">{lastSyncInfo.time}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800">
                <span className="material-symbols-outlined text-[15px] text-amber-400">person</span>
                <span className="text-slate-400 text-[11px]">Çeken Kullanıcı:</span>
                <span className="text-amber-300 font-bold text-[11px]">{lastSyncInfo.user}</span>
              </div>
            </div>
          )}
        </div>

        {/* Sağ: Otomatik Düşme Bilgisi */}
        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-2 rounded-lg border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
          <div className="flex flex-col">
            <span className="font-semibold text-white">Otomatik Aktarım Devrede</span>
            <span className="text-[11px] text-slate-400">Eklenti verisi doğrudan bu masaya kaydedilir</span>
          </div>
        </div>
      </div>

      {/* 2.5 ŞABLON MESAJ AYARLAMA PANELİ (HERKESE GİDECEK MESAJ ŞABLONU) */}
      {isTemplateEditorOpen && (
        <div className="p-4 md:p-5 rounded-xl bg-[#0F172A] border border-teal-800/60 shadow-lg flex flex-col gap-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">edit_note</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-title text-sm font-bold text-white">Devamsızlık SMS Şablonu</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Tüm Velilere Gidecek Mesaj
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Mesaja ekleyeceğiniz dinamik etiketler ([Öğrenci Adı], [Okul No], [Sınıf], [Devamsızlık Türü], [Tarih]) her veli için otomatik doldurulur.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMessageTemplate(DEFAULT_TEMPLATE);
                if (showToast) showToast('Şablon varsayılana sıfırlandı!', 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[15px] text-slate-400">restart_alt</span>
              <span>Varsayılana Sıfırla</span>
            </button>
          </div>

          {/* Dinamik Değişken Butonları */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-teal">smart_button</span>
              Tıklayarak Şablona Etiket Ekle:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { tag: '[Ogrenci_Adi]', label: 'Öğrenci Adı' },
                { tag: '[Okul_No]', label: 'Okul No' },
                { tag: '[Sinif]', label: 'Sınıf' },
                { tag: '[Devamsizlik_Turu]', label: 'Devamsızlık Türü' },
                { tag: '[Tarih]', label: 'Tarih' },
                { tag: '[Veli_Adi]', label: 'Veli Adı' },
                { tag: '[Kurum_Adi]', label: 'Kurum Adı' }
              ].map(({ tag, label }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleInsertTag(tag)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-teal-950 border border-slate-700 hover:border-teal-700 text-teal-300 text-xs font-mono transition-all active:scale-95 shadow-2xs"
                >
                  <span className="text-teal-400 font-bold">+</span>
                  <span className="font-semibold text-slate-200">{label}</span>
                  <span className="text-slate-500 text-[10px]">{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* İki Kolon: Şablon Yazma Alanı & Canlı Önizleme */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
            {/* Sol: Metin Düzenleme */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-semibold text-slate-300">Şablon Metni (Düzenlenebilir):</label>
                <span className={`font-mono ${messageTemplate.length > 160 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {messageTemplate.length} Karakter ({Math.ceil(messageTemplate.length / 160) || 1} SMS)
                </span>
              </div>
              <textarea
                rows="3"
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs p-3 font-body focus:ring-1 focus:ring-teal focus:border-teal outline-none transition-all leading-relaxed"
                placeholder="SMS şablonunuzu yazın..."
              />
            </div>

            {/* Sağ: Örnek Öğrenci Üzerinde Canlı Önizleme */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">preview</span>
                  Canlı Önizleme (Velinin Alacağı Gerçek SMS):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {sampleStudent ? `${sampleStudent.name} (${sampleStudent.class})` : 'Örnek'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/90 border border-emerald-900/50 text-xs font-mono text-emerald-300 leading-relaxed min-h-[72px] flex items-center shadow-inner">
                {sampleStudent ? generateMessageText(sampleStudent) : 'Örnek veri yok.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. İSTATİSTİK SAYAÇLARI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Toplam Devamsız */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Toplam Devamsız</span>
          <div className="text-lg font-bold text-white mt-1 flex items-baseline justify-between">
            <span>{totalCount} Öğrenci</span>
            <span className="material-symbols-outlined text-slate-500 text-[18px]">groups</span>
          </div>
        </div>

        {/* Tam Gün Yok */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-red-900/40 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] text-red-400 font-semibold uppercase">Tam Gün Yok</span>
          <div className="text-lg font-bold text-red-300 mt-1 flex items-baseline justify-between">
            <span>{fullDayCount}</span>
            <span className="material-symbols-outlined text-red-400 text-[18px]">cancel</span>
          </div>
        </div>

        {/* Öğleden Önce Yok */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-amber-900/40 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] text-amber-400 font-semibold uppercase">Öğleden Önce</span>
          <div className="text-lg font-bold text-amber-300 mt-1 flex items-baseline justify-between">
            <span>{morningCount}</span>
            <span className="material-symbols-outlined text-amber-400 text-[18px]">wb_sunny</span>
          </div>
        </div>

        {/* Öğleden Sonra Yok */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-blue-900/40 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] text-blue-400 font-semibold uppercase">Öğleden Sonra</span>
          <div className="text-lg font-bold text-blue-300 mt-1 flex items-baseline justify-between">
            <span>{afternoonCount}</span>
            <span className="material-symbols-outlined text-blue-400 text-[18px]">bedtime</span>
          </div>
        </div>

        {/* SMS Bekleyen */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-amber-800/40 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] text-amber-400 font-semibold uppercase">SMS Bekleyen</span>
          <div className="text-lg font-bold text-amber-300 mt-1 flex items-baseline justify-between">
            <span>{pendingSmsCount}</span>
            <span className="material-symbols-outlined text-amber-400 text-[18px]">pending</span>
          </div>
        </div>

        {/* SMS Gönderildi */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-emerald-900/40 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] text-emerald-400 font-semibold uppercase">SMS Gönderildi</span>
          <div className="text-lg font-bold text-emerald-300 mt-1 flex items-baseline justify-between">
            <span>{sentSmsCount}</span>
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">task_alt</span>
          </div>
        </div>

      </div>

      {/* 4. ARAMA VE DEVAMSIZLIK TÜRÜ FİLTRELERİ */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-xs">
        
        {/* Arama */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
            search
          </span>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Öğrenci adı, okul no veya sınıf ara..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Devamsızlık Türü Hapları */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              typeFilter === 'all'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/80'
            }`}
          >
            Tüm Türler ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter('Tam Gün Yok')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              typeFilter === 'Tam Gün Yok'
                ? 'bg-red-950 text-red-300 border border-red-800 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/80'
            }`}
          >
            Tam Gün Yok ({fullDayCount})
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter('Öğleden Önce Yok')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              typeFilter === 'Öğleden Önce Yok'
                ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/80'
            }`}
          >
            Öğleden Önce Yok ({morningCount})
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter('Öğleden Sonra Yok')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              typeFilter === 'Öğleden Sonra Yok'
                ? 'bg-blue-950 text-blue-300 border border-blue-800 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/80'
            }`}
          >
            Öğleden Sonra Yok ({afternoonCount})
          </button>

          <span className="text-slate-700 mx-1">|</span>

          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-amber-400 bg-amber-950/40 border border-amber-900 hover:bg-amber-900/50'
            }`}
          >
            Sadece Bekleyenler ({pendingSmsCount})
          </button>
        </div>
      </div>

      {/* 5. TOPLU SEÇİM EYLEM BARI (KAYIT SEÇİLDİĞİNDE GÖRÜNÜR) */}
      {selectedIds.length > 0 && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border border-blue-800 rounded-xl p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs text-blue-200">
            <span className="material-symbols-outlined text-blue-400 text-[20px]">check_circle</span>
            <span>
              Toplam <strong>{selectedIds.length}</strong> devamsız öğrenci seçildi.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Seçilenlere Mesaj Gönder ({selectedIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}

      {/* 6. DEVAMSIZLIK TABLOSU & MESAJ GÖNDERME ALANI */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] font-semibold tracking-wide">
                <th className="p-3.5 pl-4 w-10">
                  <input 
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredList.filter(i => i.smsStatus === 'pending').length > 0 && selectedIds.length === filteredList.filter(i => i.smsStatus === 'pending').length}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-800 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">ÖĞRENCİ</th>
                <th className="p-3.5">e-OKUL DEVAMSIZLIK TÜRÜ</th>
                <th className="p-3.5">VELİ &amp; TELEFON</th>
                <th className="p-3.5">ÇEKİLME ZAMANI</th>
                <th className="p-3.5">SMS DURUMU</th>
                <th className="p-3.5 pr-4 text-right">MESAJ GÖNDER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-slate-600 text-[36px]">inbox</span>
                      <p className="text-xs font-medium">Bu filtre kriterlerine uygun e-Okul devamsızlık kaydı bulunamadı.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isPending = item.smsStatus === 'pending';
                  const isSent = item.smsStatus === 'sent';

                  return (
                    <tr 
                      key={item.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-blue-950/30' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 pl-4">
                        {isPending ? (
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-800 cursor-pointer"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                            done
                          </span>
                        )}
                      </td>

                      {/* Öğrenci */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs flex-shrink-0">
                            {item.class}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white text-xs truncate">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              No: {item.schoolNo} • {item.class}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* e-Okul Devamsızlık Türü (Öğleden Önce Yok / Öğleden Sonra Yok / Tam Gün Yok) */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1 max-w-xs">
                          <span className={`inline-flex items-center w-max px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                            item.attendanceType === 'Tam Gün Yok'
                              ? 'bg-red-950/70 text-red-300 border-red-800'
                              : item.attendanceType === 'Öğleden Önce Yok'
                              ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                              : 'bg-blue-950/70 text-blue-300 border-blue-800'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse"></span>
                            {item.attendanceType}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate" title={item.detail}>
                            {item.detail}
                          </span>
                        </div>
                      </td>

                      {/* Veli Bilgisi */}
                      <td className="p-3.5">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-200 font-medium">
                            {item.parentName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {item.parentPhone || 'Telefon kayıtlı değil'}
                          </span>
                        </div>
                      </td>

                      {/* Çekilme Saati */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-xs text-slate-400 font-mono">
                          {item.fetchedAt}
                        </span>
                      </td>

                      {/* SMS Durumu */}
                      <td className="p-3.5 whitespace-nowrap">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-800">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            SMS Bekliyor
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800">
                              <span className="material-symbols-outlined text-[13px]">done_all</span>
                              SMS İletildi
                            </span>
                            {item.sentAt && (
                              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {item.sentAt}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Aksiyon: Mesaj Gönder (Tekli) */}
                      <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                        {isPending ? (
                          <div className="inline-flex items-center gap-1.5">
                            {/* Hızlı Önizle & Gönder */}
                            <button
                              type="button"
                              onClick={() => setPreviewItem(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold shadow-xs transition-all active:scale-95"
                              title="Mesajı incele ve veliye gönder"
                            >
                              <span className="material-symbols-outlined text-[15px]">send</span>
                              <span>Mesaj Gönder</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-semibold border border-slate-700 transition-all"
                            title="Gönderilen mesajı tekrar gönder"
                          >
                            <span className="material-symbols-outlined text-[14px]">replay</span>
                            <span>Tekrar At</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. TEKLİ MESAJ GÖNDERME & ÖNİZLEME MODALI */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0F172A] border border-slate-700 rounded-xl max-w-lg w-full p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">chat</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Veli Devamsızlık Mesajı Gönder</h3>
                <p className="text-xs text-slate-400">Netgsm üzerinden tekil SMS iletimi</p>
              </div>
            </div>

            {/* Öğrenci & Veli Özet Kutusu */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Öğrenci:</span>
                <strong className="text-white">{previewItem.name}</strong>
                <span className="text-slate-400 block text-[11px]">No: {previewItem.schoolNo} • {previewItem.class}</span>
              </div>

              <div>
                <span className="text-slate-400 block">Devamsızlık Durumu:</span>
                <span className={`inline-block font-bold text-xs mt-0.5 ${
                  previewItem.attendanceType === 'Tam Gün Yok' ? 'text-red-400' :
                  previewItem.attendanceType === 'Öğleden Önce Yok' ? 'text-amber-400' : 'text-blue-400'
                }`}>
                  {previewItem.attendanceType}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Veli Adı:</span>
                <span className="text-slate-200">{previewItem.parentName}</span>
              </div>

              <div>
                <span className="text-slate-400 block">Veli Telefonu:</span>
                <span className="font-mono text-emerald-400 font-bold">{previewItem.parentPhone}</span>
              </div>
            </div>

            {/* İletilecek SMS Metni */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">İletilecek SMS İçeriği (Netgsm YEMTAL Başlıklı):</span>
                <span className="text-slate-400 font-mono text-[11px]">1 Kredi / 160 Karakter</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono leading-relaxed">
                {generateMessageText(previewItem)}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <span>Mevcut SMS Bakiyeniz: <strong className="text-white">{smsBalance.toLocaleString('tr-TR')} Adet</strong></span>
              
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                >
                  İptal
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSingleSend}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Mesajı Gönder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. TOPLU MESAJ GÖNDERİM ONAY MODALI */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0F172A] border border-slate-700 rounded-xl max-w-md w-full p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">forward_to_inbox</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Toplu Devamsızlık SMS Gönderimi</h3>
                <p className="text-xs text-slate-400">e-Okul yoklama kayıtları velilere iletilecek</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Hedef Veli Sayısı:</span>
                <strong className="text-white text-sm">
                  {selectedIds.length > 0 ? selectedIds.length : pendingSmsCount} Kişi
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">SMS Başlığı:</span>
                <span className="text-teal font-bold">YEMTAL (Netgsm Onaylı)</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Düşecek Bakiye:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  -{selectedIds.length > 0 ? selectedIds.length : pendingSmsCount} Adet
                </span>
              </div>
            </div>

            {/* Şablon Mesaj Önizlemesi */}
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-400 text-xs font-semibold">Gönderilecek Mesaj Formatı:</span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 leading-relaxed max-h-28 overflow-y-auto shadow-inner">
                {sampleStudent ? generateMessageText(sampleStudent) : ''}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Yukarıda ayarlanan şablon baz alınarak, her veliye kendi öğrencisinin devamsızlık türü ve okul bilgileriyle otomatik doldurulup iletilecektir.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleConfirmBulkSend}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Tümüne Gönder</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

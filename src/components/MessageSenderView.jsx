import React, { useState } from 'react';
import { SMS_TEMPLATES } from '../data/mockData';

export default function MessageSenderView({ onSendManualSms, smsBalance, showToast }) {
  const [targetType, setTargetType] = useState('class');
  const [selectedClass, setSelectedClass] = useState('9-A');
  const [customPhone, setCustomPhone] = useState('');
  const [messageText, setMessageText] = useState('');

  const charLength = messageText.length;
  const creditsNeeded = Math.ceil(charLength / 160) || 1;

  const handleTemplateChange = (e) => {
    const tpl = SMS_TEMPLATES.find(t => t.id === e.target.value);
    if (tpl) {
      setMessageText(tpl.text);
    }
  };

  const handleInsertVariable = (varCode) => {
    setMessageText(prev => prev + varCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      showToast('Lütfen gönderilecek bir mesaj metni yazın!', 'error');
      return;
    }

    let targetDesc = '';
    let count = 1;

    if (targetType === 'class') {
      targetDesc = `${selectedClass} Şubesi Velileri`;
      count = 32;
    } else if (targetType === 'all') {
      targetDesc = 'Tüm Okul Velileri';
      count = 832;
    } else {
      if (!customPhone.trim()) {
        showToast('Lütfen alıcı telefon numarasını girin!', 'error');
        return;
      }
      targetDesc = `Özel Numara (${customPhone})`;
      count = 1;
    }

    if (smsBalance < count * creditsNeeded) {
      showToast('Yetersiz Netgsm SMS bakiyesi!', 'error');
      return;
    }

    onSendManualSms({
      targetDesc,
      count: count * creditsNeeded,
      messageText
    });

    setMessageText('');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fadeIn">
      
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-navy dark:text-blue-400 flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">chat</span>
        </div>
        <div>
          <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
            Manuel Mesaj Gönderim Merkezi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sınıf, grup veya okul geneline Netgsm üzerinden anlık SMS gönderimi ve canlı önizleme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Sol 2 Kolon: Mesaj Oluşturucu */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-5 shadow-xs">
          
          {/* Hedef Kitle Seçimi */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Hedef Alıcı Kitlesi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input 
                  type="radio" 
                  name="sms_target" 
                  value="class" 
                  checked={targetType === 'class'} 
                  onChange={() => setTargetType('class')}
                  className="text-navy focus:ring-navy" 
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sınıf / Şube</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input 
                  type="radio" 
                  name="sms_target" 
                  value="all" 
                  checked={targetType === 'all'} 
                  onChange={() => setTargetType('all')}
                  className="text-navy focus:ring-navy" 
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Tüm Okul Velileri</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input 
                  type="radio" 
                  name="sms_target" 
                  value="custom" 
                  checked={targetType === 'custom'} 
                  onChange={() => setTargetType('custom')}
                  className="text-navy focus:ring-navy" 
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Özel Numara Gir</span>
              </label>
            </div>
          </div>

          {/* Şube Seçimi veya Özel Numara Alanı */}
          {targetType === 'class' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Şube Seçiniz:</label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2.5"
              >
                <option value="9-A">9-A Bilişim Teknolojileri (34 Veli)</option>
                <option value="9-B">9-B Bilişim Teknolojileri (33 Veli)</option>
                <option value="10-A">10-A Elektrik-Elektronik (31 Veli)</option>
                <option value="10-B">10-B Elektrik-Elektronik (32 Veli)</option>
                <option value="11-A">11-A Makine Teknolojisi (28 Veli)</option>
                <option value="12-C">12-C Motorlu Araçlar (30 Veli)</option>
              </select>
            </div>
          )}

          {targetType === 'custom' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Alıcı Telefon Numarası:</label>
              <input 
                type="text" 
                placeholder="Örn: 0532 123 45 67" 
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                className="text-xs font-code p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          )}

          {/* Hazır Şablon Seçici */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hazır SMS Şablonu Yükle:</label>
            <select 
              onChange={handleTemplateChange}
              defaultValue=""
              className="text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2.5"
            >
              <option value="">-- Şablon Seçiniz (İsteğe Bağlı) --</option>
              {SMS_TEMPLATES.map(tpl => (
                <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
              ))}
            </select>
          </div>

          {/* Dinamik Değişken Butonları */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Dinamik Değişkenler:</span>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => handleInsertVariable(' [Ogrenci_Adi]')} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-slate-700 dark:text-slate-300 text-xs font-code border border-slate-300 dark:border-slate-700 transition-colors">+ [Ogrenci_Adi]</button>
              <button type="button" onClick={() => handleInsertVariable(' [Veli_Adi]')} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-slate-700 dark:text-slate-300 text-xs font-code border border-slate-300 dark:border-slate-700 transition-colors">+ [Veli_Adi]</button>
              <button type="button" onClick={() => handleInsertVariable(' [Tarih]')} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-slate-700 dark:text-slate-300 text-xs font-code border border-slate-300 dark:border-slate-700 transition-colors">+ [Tarih]</button>
              <button type="button" onClick={() => handleInsertVariable(' [Okul_Adi]')} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-slate-700 dark:text-slate-300 text-xs font-code border border-slate-300 dark:border-slate-700 transition-colors">+ [Okul_Adi]</button>
            </div>
          </div>

          {/* Mesaj Metni */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">SMS Mesaj Metni:</label>
              <div className="flex items-center gap-2 font-code text-slate-500">
                <span>{charLength} Karakter</span>
                <span>|</span>
                <span className="font-bold text-navy dark:text-blue-400">{creditsNeeded} SMS Kredisi</span>
              </div>
            </div>
            <textarea 
              rows={5} 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Mesajınızı buraya yazın veya yukarıdan hazır şablon seçin..."
              className="w-full text-xs font-body p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-navy focus:border-navy"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">Gönderici Başlığı: <strong>YEMTAL</strong></span>
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-navy text-white rounded-md text-xs font-bold hover:bg-blue-900 shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Mesajı Gönder</span>
            </button>
          </div>

        </form>

        {/* Sağ 1 Kolon: Canlı Telefon Önizlemesi */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Canlı Telefon Önizlemesi</span>
          
          <div className="phone-mockup flex flex-col justify-between p-4 overflow-hidden">
            <div className="pt-6 pb-2 border-b border-slate-300 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-bold text-slate-800">YEMTAL</div>
                <div className="text-[10px] text-slate-500">Netgsm SMS Bildirimi</div>
              </div>
            </div>

            <div className="flex-1 py-4 overflow-y-auto flex flex-col gap-2">
              <div className="self-start max-w-[85%] bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs border border-slate-200">
                <p className="text-xs text-slate-800 font-body break-words leading-relaxed">
                  {messageText || 'Mesaj içeriği burada canlı önizlenecektir...'}
                </p>
                <span className="text-[9px] text-slate-400 block text-right mt-1">Şimdi</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 pb-1">
              Netgsm SMS Altyapısı
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

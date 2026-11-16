import React, { useState } from 'react';

export default function DirectoryView({ directoryList, onUpdateStudent, showToast }) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  // Form State
  const [p1Name, setP1Name] = useState('');
  const [p1Phone, setP1Phone] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [p2Phone, setP2Phone] = useState('');

  const filteredList = directoryList.filter(item => {
    if (filterType === 'missing_phone' && (item.status !== 'missing_phone' && item.parent1Phone)) return false;
    if (filterType === 'missing_parent2' && item.status !== 'missing_parent2') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.schoolNo.includes(q) ||
        item.class.toLowerCase().includes(q) ||
        (item.parent1Phone && item.parent1Phone.includes(q))
      );
    }
    return true;
  });

  const handleOpenEdit = (item) => {
    setEditingStudent(item);
    setP1Name(item.parent1Name || '');
    setP1Phone(item.parent1Phone || '');
    setP2Name(item.parent2Name || '');
    setP2Phone(item.parent2Phone || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    onUpdateStudent(editingStudent.id, {
      parent1Name: p1Name,
      parent1Phone: p1Phone,
      parent2Name: p2Name,
      parent2Phone: p2Phone
    });

    setEditingStudent(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-navy dark:text-blue-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">contacts</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
              Rehberim (Öğrenci &amp; Veli İletişim Havuzu)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tüm öğrenci ve veli numaralarını görüntüleyin, eksikleri tamamlayın</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => showToast('Rehber Excel dosyası olarak indirildi', 'info')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Dışa Aktar (Excel)</span>
          </button>
        </div>
      </div>

      {/* Filtre ve Arama Çubuğu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all shadow-xs ${
              filterType === 'all' ? 'bg-navy text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Tüm Kayıtlar (840)
          </button>
          <button 
            type="button"
            onClick={() => setFilterType('missing_phone')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
              filterType === 'missing_phone' 
                ? 'bg-crimson text-white border-crimson' 
                : 'border-red-300 dark:border-red-800 text-crimson dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
            }`}
          >
            Numarası Eksik Olanlar (8)
          </button>
          <button 
            type="button"
            onClick={() => setFilterType('missing_parent2')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
              filterType === 'missing_parent2' 
                ? 'bg-navy text-white border-navy' 
                : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            2. Veli Numarası Eksik (45)
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="İsim, okul no veya tel ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-[16px]">search</span>
        </div>
      </div>

      {/* Rehber Tablosu */}
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                <th className="py-3 px-4">Okul No</th>
                <th className="py-3 px-4">Öğrenci Adı</th>
                <th className="py-3 px-3">Şube</th>
                <th className="py-3 px-4">1. Veli (Öncelikli)</th>
                <th className="py-3 px-4">2. Veli (Yedek)</th>
                <th className="py-3 px-3">Durum</th>
                <th className="py-3 px-4 text-right">Düzenle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredList.map(item => {
                const hasPhone1 = !!item.parent1Phone;
                const hasPhone2 = !!item.parent2Phone;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-code font-bold text-navy dark:text-blue-400">{item.schoolNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">{item.class}</span>
                    </td>
                    <td className="py-3 px-4">
                      {hasPhone1 ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{item.parent1Name}</span>
                          <span className="font-code text-xs text-slate-600 dark:text-slate-400">{item.parent1Phone}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-crimson font-semibold bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                          <span className="material-symbols-outlined text-[13px]">phone_disabled</span> Numara Yok
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {hasPhone2 ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{item.parent2Name}</span>
                          <span className="font-code text-xs text-slate-600 dark:text-slate-400">{item.parent2Phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">Tanımlanmamış</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {hasPhone1 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span> Tam
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-crimson dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded border border-red-200 dark:border-red-900 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-crimson"></span> Eksik Kayıt
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        type="button" 
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-navy dark:hover:text-blue-400 transition-colors"
                        title="Düzenle"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Düzenleme Modalı */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleSaveEdit} className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-navy dark:text-blue-400 text-[20px]">edit</span>
                Veli İletişim Bilgilerini Düzenle
              </h3>
              <button type="button" onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Öğrenci:</label>
                <input 
                  type="text" 
                  disabled 
                  value={`${editingStudent.schoolNo} - ${editingStudent.name} (${editingStudent.class})`}
                  className="w-full p-2 mt-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">1. Veli Yakınlık / İsim:</label>
                  <input 
                    type="text" 
                    value={p1Name} 
                    onChange={(e) => setP1Name(e.target.value)}
                    className="w-full p-2 mt-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">1. Veli Telefonu:</label>
                  <input 
                    type="text" 
                    value={p1Phone} 
                    onChange={(e) => setP1Phone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full p-2 mt-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-code font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">2. Veli Yakınlık / İsim:</label>
                  <input 
                    type="text" 
                    value={p2Name} 
                    onChange={(e) => setP2Name(e.target.value)}
                    className="w-full p-2 mt-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">2. Veli Telefonu:</label>
                  <input 
                    type="text" 
                    value={p2Phone} 
                    onChange={(e) => setP2Phone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full p-2 mt-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-code"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button 
                type="button" 
                onClick={() => setEditingStudent(null)} 
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                İptal
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 text-xs font-bold bg-navy text-white rounded-md hover:bg-blue-900 shadow-xs"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

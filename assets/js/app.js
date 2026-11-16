/**
 * YEMTAL-VBS — Ana Uygulama Mantığı (Single Page Application Router & State Manager)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Temel Durum Başlatma
  initSidebar();
  initTheme();
  initRouter();
  initAttendanceView();
  initDirectoryView();
  initMessageSenderView();
  initSettingsView();
  updateHeaderStats();
});

// ==========================================
// 1. SİDEBAR & AKORDİYON & MOBİL YÖNETİMİ
// ==========================================
function initSidebar() {
  const toggleBtn = document.getElementById('accordion-toggle');
  const menu = document.getElementById('accordion-menu');
  const icon = document.getElementById('accordion-icon');

  if (toggleBtn && menu && icon) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        menu.classList.add('hidden');
        icon.style.transform = 'rotate(-90deg)';
      } else {
        menu.classList.remove('hidden');
        icon.style.transform = 'rotate(0deg)';
      }
    });
  }

  // Mobil Hamburger Menü
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('main-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (mobileToggle && sidebar && backdrop) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
      backdrop.classList.toggle('hidden');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
    });
  }
}

// ==========================================
// 2. TEMA YÖNETİMİ (DARK / LIGHT MODE)
// ==========================================
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('yemtal_theme') || 'light';

  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcon(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('yemtal_theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
      showToast(isDark ? 'Karanlık mod aktif edildi' : 'Aydınlık mod aktif edildi', 'info');
    });
  }
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  }
}

// ==========================================
// 3. SPA ROUTER (SAYFA / GÖRÜNÜM YÖNETİMİ)
// ==========================================
const VALID_VIEWS = [
  'dashboard',
  'devamsizlik-otomasyon',
  'ogrenci-listesi-cek',
  'siniflar-oto-mesaj',
  'mesaj-gonder',
  'rehberim',
  'ayarlar'
];

function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  // İlk yüklemede hash kontrolü
  if (!window.location.hash) {
    window.location.hash = '#dashboard';
  } else {
    handleRoute();
  }
}

function handleRoute() {
  let hash = window.location.hash.replace('#', '') || 'dashboard';

  // Alt sekmeler veya takma adlar
  if (hash === 'rehbere-git' || hash === 'eksikleri-gor') {
    hash = 'rehberim';
  } else if (hash === 'devamsizlik-sms-ekrani') {
    hash = 'devamsizlik-otomasyon';
  } else if (hash === 'sinifli-mesaj' || hash === 'secimli-mesaj' || hash === 'okul-no-sms' || hash === 'telefon-no-sms') {
    hash = 'mesaj-gonder';
  }

  if (!VALID_VIEWS.includes(hash)) {
    hash = 'dashboard';
  }

  // Tüm görünümleri gizle
  VALID_VIEWS.forEach(viewId => {
    const el = document.getElementById(`view-${viewId}`);
    if (el) el.classList.add('hidden');
  });

  // Hedef görünümü göster
  const targetView = document.getElementById(`view-${hash}`);
  if (targetView) {
    targetView.classList.remove('hidden');
    targetView.classList.add('view-section');
  }

  // Menü aktiflik durumunu güncelle
  updateNavActiveState(hash);

  // Varsa mobil menüyü kapat
  const sidebar = document.getElementById('main-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar && backdrop && !sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  }

  // Sayfanın en üstüne kaydır
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Eğer doğrudan eksikler linki ile gelindiyse filtreyi uygula
  if (window.location.hash === '#eksikleri-gor') {
    filterDirectory('missing_phone');
  }
}

function updateNavActiveState(currentHash) {
  const navLinks = document.querySelectorAll('[data-nav-target]');
  navLinks.forEach(link => {
    const target = link.getAttribute('data-nav-target');
    if (target === currentHash) {
      link.classList.add('bg-blue-50/80', 'text-navy', 'font-semibold', 'border-l-4', 'border-navy');
      link.classList.remove('text-slate-700');
    } else {
      link.classList.remove('bg-blue-50/80', 'text-navy', 'font-semibold', 'border-l-4', 'border-navy');
      link.classList.add('text-slate-700');
    }
  });
}

// ==========================================
// 4. HEADER & İSTATİSTİK GÜNCELLEMELERİ
// ==========================================
function updateHeaderStats() {
  const smsElements = document.querySelectorAll('.dynamic-sms-balance');
  smsElements.forEach(el => {
    el.textContent = YEMTAL_DATA.system.smsBalance.toLocaleString('tr-TR');
  });

  const studentCountElements = document.querySelectorAll('.dynamic-student-count');
  studentCountElements.forEach(el => {
    el.textContent = YEMTAL_DATA.system.totalStudents;
  });

  const parentCountElements = document.querySelectorAll('.dynamic-parent-count');
  parentCountElements.forEach(el => {
    el.textContent = YEMTAL_DATA.system.totalParents;
  });
}

// ==========================================
// 5. DEVAMSIZLIK E-OKUL OTOMASYON EKRANI
// ==========================================
function initAttendanceView() {
  renderAttendanceTable();

  // Şube filtreleme
  const filterClass = document.getElementById('attendance-filter-class');
  if (filterClass) {
    filterClass.addEventListener('change', () => {
      renderAttendanceTable(filterClass.value);
    });
  }

  // Toplu SMS Gönder Butonu
  const sendAllBtn = document.getElementById('btn-send-all-attendance-sms');
  if (sendAllBtn) {
    sendAllBtn.addEventListener('click', () => {
      openAttendanceModal();
    });
  }

  // Modal İçi Onayla Butonu
  const confirmSendBtn = document.getElementById('btn-confirm-send-attendance');
  if (confirmSendBtn) {
    confirmSendBtn.addEventListener('click', () => {
      executeBulkAttendanceSms();
    });
  }
}

function renderAttendanceTable(classFilter = 'all') {
  const tbody = document.getElementById('attendance-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  const filtered = YEMTAL_DATA.attendanceList.filter(item => {
    if (classFilter === 'all') return true;
    return item.class === classFilter;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-500 font-body text-sm">
          Seçilen sınıfta devamsızlık kaydı bulunamadı.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(item => {
    const isSent = item.smsStatus === 'sent';
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs text-slate-700';
    tr.innerHTML = `
      <td class="py-3 px-4 font-code font-bold text-navy">${item.schoolNo}</td>
      <td class="py-3 px-4 font-semibold text-slate-900">${item.name}</td>
      <td class="py-3 px-3"><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">${item.class}</span></td>
      <td class="py-3 px-3">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${item.typeBadge}">
          ${item.type}
        </span>
      </td>
      <td class="py-3 px-4">
        <div class="flex flex-col">
          <span class="font-medium text-slate-800">${item.parentName}</span>
          <span class="font-code text-[11px] text-slate-500">${item.parentPhone}</span>
        </div>
      </td>
      <td class="py-3 px-3">
        ${isSent ? `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald"></span> İletildi
          </span>
        ` : `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Bekliyor
          </span>
        `}
      </td>
      <td class="py-3 px-4 text-right">
        ${isSent ? `
          <button disabled class="px-2.5 py-1 text-slate-400 bg-slate-100 rounded text-xs cursor-not-allowed">
            Gönderildi
          </button>
        ` : `
          <button onclick="sendSingleAttendanceSms(${item.id})" class="inline-flex items-center gap-1 px-3 py-1 bg-navy text-white rounded text-xs font-semibold hover:bg-blue-900 shadow-sm transition-all">
            <span class="material-symbols-outlined text-[14px]">send</span> Gönder
          </button>
        `}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAttendanceModal() {
  const pendingCount = YEMTAL_DATA.attendanceList.filter(i => i.smsStatus !== 'sent').length;
  if (pendingCount === 0) {
    showToast('Tüm devamsız öğrencilerin velilerine zaten SMS gönderildi!', 'info');
    return;
  }

  const modal = document.getElementById('modal-attendance-sms');
  const countEl = document.getElementById('modal-pending-count');
  const costEl = document.getElementById('modal-sms-cost');

  if (countEl) countEl.textContent = pendingCount;
  if (costEl) costEl.textContent = `${pendingCount} Adet Netgsm Kredisi`;

  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeAttendanceModal() {
  const modal = document.getElementById('modal-attendance-sms');
  if (modal) modal.classList.add('hidden');
}

function executeBulkAttendanceSms() {
  closeAttendanceModal();
  const pending = YEMTAL_DATA.attendanceList.filter(i => i.smsStatus !== 'sent');
  const count = pending.length;

  if (count === 0) return;

  // Durumları sent yap
  pending.forEach(i => i.smsStatus = 'sent');

  // Bakiyeden düş
  YEMTAL_DATA.system.smsBalance -= count;
  updateHeaderStats();

  renderAttendanceTable();
  showToast(`${count} adet devamsızlık SMS bildirimi başarıyla velilere iletildi!`, 'success');
}

window.sendSingleAttendanceSms = function(id) {
  const item = YEMTAL_DATA.attendanceList.find(i => i.id === id);
  if (!item) return;

  item.smsStatus = 'sent';
  YEMTAL_DATA.system.smsBalance -= 1;
  updateHeaderStats();
  renderAttendanceTable();
  showToast(`${item.name} öğrencisinin velisine (${item.parentPhone}) SMS iletildi.`, 'success');
};

// ==========================================
// 6. REHBER YÖNETİMİ & EKSİK VERİLER EKRANI
// ==========================================
let currentDirectoryFilter = 'all';

function initDirectoryView() {
  renderDirectoryTable();

  const searchInput = document.getElementById('directory-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderDirectoryTable(currentDirectoryFilter, e.target.value);
    });
  }

  // Filtre Butonları
  const filterBtns = document.querySelectorAll('[data-dir-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-navy', 'text-white'));
      btn.classList.add('bg-navy', 'text-white');
      currentDirectoryFilter = btn.getAttribute('data-dir-filter');
      renderDirectoryTable(currentDirectoryFilter);
    });
  });
}

function filterDirectory(filterType) {
  currentDirectoryFilter = filterType;
  const filterBtns = document.querySelectorAll('[data-dir-filter]');
  filterBtns.forEach(b => {
    if (b.getAttribute('data-dir-filter') === filterType) {
      b.classList.add('bg-navy', 'text-white');
    } else {
      b.classList.remove('bg-navy', 'text-white');
    }
  });
  renderDirectoryTable(filterType);
}

function renderDirectoryTable(filter = 'all', searchQuery = '') {
  const tbody = document.getElementById('directory-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  let list = YEMTAL_DATA.directory;

  if (filter === 'missing_phone') {
    list = list.filter(i => i.status === 'missing_phone' || !i.parent1Phone);
  } else if (filter === 'missing_parent2') {
    list = list.filter(i => i.status === 'missing_parent2');
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(i => 
      i.name.toLowerCase().includes(q) ||
      i.schoolNo.includes(q) ||
      i.class.toLowerCase().includes(q) ||
      (i.parent1Phone && i.parent1Phone.includes(q))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-500 font-body text-sm">
          Arama kriterine uygun öğrenci/veli kaydı bulunamadı.
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs text-slate-700';

    const hasPhone1 = !!item.parent1Phone;
    const hasPhone2 = !!item.parent2Phone;

    tr.innerHTML = `
      <td class="py-3 px-4 font-code font-bold text-navy">${item.schoolNo}</td>
      <td class="py-3 px-4 font-semibold text-slate-900">${item.name}</td>
      <td class="py-3 px-3"><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">${item.class}</span></td>
      <td class="py-3 px-4">
        ${hasPhone1 ? `
          <div class="flex flex-col">
            <span class="font-medium text-slate-800">${item.parent1Name}</span>
            <span class="font-code text-xs text-slate-600">${item.parent1Phone}</span>
          </div>
        ` : `
          <span class="inline-flex items-center gap-1 text-crimson font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
            <span class="material-symbols-outlined text-[13px]">phone_disabled</span> Numara Yok
          </span>
        `}
      </td>
      <td class="py-3 px-4">
        ${hasPhone2 ? `
          <div class="flex flex-col">
            <span class="font-medium text-slate-800">${item.parent2Name}</span>
            <span class="font-code text-xs text-slate-600">${item.parent2Phone}</span>
          </div>
        ` : `
          <span class="text-slate-400 text-xs font-medium">Tanımlanmamış</span>
        `}
      </td>
      <td class="py-3 px-3">
        ${hasPhone1 ? `
          <span class="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald"></span> Tam
          </span>
        ` : `
          <span class="inline-flex items-center gap-1 text-[11px] text-crimson bg-red-50 px-2 py-0.5 rounded border border-red-200 font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-crimson"></span> Eksik Kayıt
          </span>
        `}
      </td>
      <td class="py-3 px-4 text-right">
        <button onclick="openEditStudentModal(${item.id})" class="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-navy transition-colors" title="Düzenle">
          <span class="material-symbols-outlined text-[16px]">edit</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openEditStudentModal = function(id) {
  const item = YEMTAL_DATA.directory.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('modal-edit-student');
  if (!modal) return;

  document.getElementById('edit-student-id').value = item.id;
  document.getElementById('edit-student-name').value = `${item.schoolNo} - ${item.name} (${item.class})`;
  document.getElementById('edit-parent1-name').value = item.parent1Name || '';
  document.getElementById('edit-parent1-phone').value = item.parent1Phone || '';
  document.getElementById('edit-parent2-name').value = item.parent2Name || '';
  document.getElementById('edit-parent2-phone').value = item.parent2Phone || '';

  modal.classList.remove('hidden');
};

function closeEditStudentModal() {
  const modal = document.getElementById('modal-edit-student');
  if (modal) modal.classList.add('hidden');
}

function saveStudentDirectoryEdit() {
  const id = parseInt(document.getElementById('edit-student-id').value);
  const item = YEMTAL_DATA.directory.find(i => i.id === id);
  if (!item) return;

  const p1Phone = document.getElementById('edit-parent1-phone').value.trim();
  const p1Name = document.getElementById('edit-parent1-name').value.trim();
  const p2Phone = document.getElementById('edit-parent2-phone').value.trim();
  const p2Name = document.getElementById('edit-parent2-name').value.trim();

  item.parent1Phone = p1Phone;
  item.parent1Name = p1Name;
  item.parent2Phone = p2Phone;
  item.parent2Name = p2Name;

  if (p1Phone) {
    item.status = 'complete';
  } else {
    item.status = 'missing_phone';
  }

  closeEditStudentModal();
  renderDirectoryTable(currentDirectoryFilter);
  showToast(`${item.name} veli iletişim bilgileri güncellendi!`, 'success');
}

// ==========================================
// 7. MANUEL MESAJ GÖNDERİM MERKEZİ
// ==========================================
function initMessageSenderView() {
  const textarea = document.getElementById('sms-message-text');
  const preview = document.getElementById('phone-sms-preview-text');
  const charCount = document.getElementById('sms-char-count');
  const smsCount = document.getElementById('sms-credits-needed');
  const templateSelect = document.getElementById('sms-template-select');

  if (textarea) {
    textarea.addEventListener('input', () => {
      const text = textarea.value;
      if (preview) {
        preview.textContent = text || 'Mesaj içeriği burada canlı önizlenecektir...';
      }
      if (charCount) {
        const len = text.length;
        const credits = Math.ceil(len / 160) || 1;
        charCount.textContent = `${len} Karakter`;
        if (smsCount) smsCount.textContent = `${credits} SMS`;
      }
    });
  }

  // Şablon Seçimi
  if (templateSelect) {
    templateSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      const tpl = YEMTAL_DATA.smsTemplates.find(t => t.id === val);
      if (tpl && textarea) {
        textarea.value = tpl.text;
        textarea.dispatchEvent(new Event('input'));
      }
    });
  }

  // Değişken Butonları
  const varBtns = document.querySelectorAll('[data-insert-var]');
  varBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const variable = btn.getAttribute('data-insert-var');
      insertVariableToTextarea(variable);
    });
  });

  // Gönderim Butonu
  const sendBtn = document.getElementById('btn-send-manual-sms');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      executeManualSmsSend();
    });
  }
}

function insertVariableToTextarea(variable) {
  const textarea = document.getElementById('sms-message-text');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  textarea.value = text.substring(0, start) + variable + text.substring(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + variable.length;
  textarea.dispatchEvent(new Event('input'));
}

function executeManualSmsSend() {
  const textarea = document.getElementById('sms-message-text');
  if (!textarea || !textarea.value.trim()) {
    showToast('Lütfen gönderilecek bir SMS metni yazın!', 'error');
    return;
  }

  const targetType = document.querySelector('input[name="sms_target_type"]:checked')?.value || 'class';
  let targetCount = 34; // Varsayılan bir şube
  let targetLabel = "9-A Bilişim Teknolojileri";

  if (targetType === 'all') {
    targetCount = 832;
    targetLabel = "Tüm Okul Velileri";
  }

  if (YEMTAL_DATA.system.smsBalance < targetCount) {
    showToast('Yetersiz Netgsm SMS bakiyesi!', 'error');
    return;
  }

  YEMTAL_DATA.system.smsBalance -= targetCount;
  updateHeaderStats();

  showToast(`${targetLabel} için ${targetCount} adet SMS başarıyla kuyruğa alındı ve gönderiliyor!`, 'success');
  textarea.value = '';
  textarea.dispatchEvent(new Event('input'));
}

// ==========================================
// 8. E-OKUL SENKRONİZASYON SİMÜLASYONU
// ==========================================
function startEOkulSyncSimulation() {
  const btn = document.getElementById('btn-trigger-eokul-sync');
  const progressWrapper = document.getElementById('sync-progress-wrapper');
  const progressBar = document.getElementById('sync-progress-bar');
  const statusText = document.getElementById('sync-status-text');

  if (!btn || !progressWrapper || !progressBar || !statusText) return;

  btn.disabled = true;
  btn.classList.add('opacity-50', 'cursor-not-allowed');
  progressWrapper.classList.remove('hidden');

  let step = 0;
  const interval = setInterval(() => {
    step += 25;
    progressBar.style.width = `${step}%`;

    if (step === 25) {
      statusText.textContent = "e-Okul Veli Bilgilendirme Sistemi oturumu doğrulanıyor...";
    } else if (step === 50) {
      statusText.textContent = "Günlük e-Okul yoklama defteri ve şubeler taranıyor...";
    } else if (step === 75) {
      statusText.textContent = "18 devamsız öğrenci ve veli telefonları senkronize ediliyor...";
    } else if (step >= 100) {
      clearInterval(interval);
      statusText.textContent = "Senkronizasyon Başarılı!";
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');

      setTimeout(() => {
        progressWrapper.classList.add('hidden');
        showToast("e-Okul verileri başarıyla güncellendi! 18 devamsız öğrenci hazır.", "success");
      }, 1000);
    }
  }, 400);
}
window.startEOkulSyncSimulation = startEOkulSyncSimulation;

// ==========================================
// 9. AYARLAR EKRANI
// ==========================================
function initSettingsView() {
  const saveBtn = document.getElementById('btn-save-settings');
  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = document.getElementById('setting-sms-title')?.value || 'YEMTAL';
      const code = document.getElementById('setting-school-code')?.value || 'YEMTAL-01';

      YEMTAL_DATA.system.smsSenderTitle = title;
      YEMTAL_DATA.system.institutionCode = code;

      showToast('Sistem ve Netgsm API ayarları başarıyla kaydedildi!', 'success');
    });
  }

  const testApiBtn = document.getElementById('btn-test-api');
  if (testApiBtn) {
    testApiBtn.addEventListener('click', () => {
      showToast('Netgsm API bağlantısı başarılı! Bakiye: 4.250 SMS', 'success');
    });
  }
}

// ==========================================
// 10. TOAST BİLDİRİM MOTORU
// ==========================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-enter pointer-events-auto flex items-center gap-3 p-3.5 rounded-lg shadow-lg border text-sm font-medium ${
    type === 'success' ? 'bg-white text-emerald-900 border-emerald-300 dark:bg-slate-900 dark:text-emerald-300 dark:border-emerald-700' :
    type === 'error' ? 'bg-white text-crimson border-red-300 dark:bg-slate-900 dark:text-red-400 dark:border-red-800' :
    'bg-white text-navy border-blue-200 dark:bg-slate-900 dark:text-blue-300 dark:border-blue-800'
  }`;

  const iconName = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
  const iconColor = type === 'success' ? 'text-emerald' : type === 'error' ? 'text-crimson' : 'text-navy';

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[20px] flex-shrink-0">${iconName}</span>
    <span class="flex-1">${message}</span>
    <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined text-[16px]">close</span>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease-out';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}
window.showToast = showToast;

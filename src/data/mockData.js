/**
 * YEMTAL-VBS — React Mock Verileri (Roller: Admin, Müdür, Müdür Yardımcısı, Öğretmen)
 */

export const INITIAL_USERS = [
  {
    id: 1,
    name: "Admin",
    phone: "0500 000 00 00",
    password: "••••••••",
    role: "admin",
    roleLabel: "Admin",
    title: "Sistem Yöneticisi",
    status: "active",
    avatar: "AD",
    createdAt: "01.09.2026",
    lastLogin: "Bugün 21:10"
  },
  {
    id: 2,
    name: "Yakup Polat",
    phone: "0532 100 20 30",
    password: "••••••••",
    role: "principal",
    roleLabel: "Müdür",
    title: "Okul Müdürü",
    status: "active",
    avatar: "YP",
    createdAt: "01.09.2026",
    lastLogin: "Bugün 19:25"
  },
  {
    id: 3,
    name: "Selim Çetin",
    phone: "0542 200 30 40",
    password: "••••••••",
    role: "vice_principal",
    roleLabel: "Müdür Yardımcısı",
    title: "Müdür Yardımcısı",
    status: "active",
    avatar: "SÇ",
    createdAt: "05.09.2026",
    lastLogin: "Bugün 16:40"
  },
  {
    id: 4,
    name: "Ayşe Kaya",
    phone: "0555 300 40 50",
    password: "••••••••",
    role: "teacher",
    roleLabel: "Öğretmen",
    title: "Bilişim Öğretmeni",
    status: "active",
    avatar: "AK",
    createdAt: "15.09.2026",
    lastLogin: "Bugün 14:15"
  }
];

export const INITIAL_LOGS = [
  {
    id: 1,
    timestamp: "16.11.2026 21:05",
    userId: 1,
    userName: "Admin",
    userRole: "Admin",
    action: "Sistem Girişi",
    category: "user_mgmt",
    description: "Ana yönetici Admin hesabı ile sisteme giriş yapıldı.",
    status: "success",
    ip: "192.168.1.1"
  },
  {
    id: 2,
    timestamp: "16.11.2026 19:18",
    userId: 2,
    userName: "Yakup Polat",
    userRole: "Müdür",
    action: "Devamsızlık SMS Gönderimi",
    category: "sms",
    description: "e-Okul'dan çekilen 18 devamsız öğrenci velisine otomatik bilgilendirme SMS'i gönderildi.",
    status: "success",
    ip: "192.168.1.10"
  },
  {
    id: 3,
    timestamp: "16.11.2026 15:45",
    userId: 3,
    userName: "Selim Çetin",
    userRole: "Müdür Yardımcısı",
    action: "Rehber Düzenleme",
    category: "directory",
    description: "10-B sınıfından Gizem Güneş öğrencisinin veli iletişim telefonu güncellendi.",
    status: "info",
    ip: "192.168.1.24"
  },
  {
    id: 4,
    timestamp: "16.11.2026 14:30",
    userId: 4,
    userName: "Ayşe Kaya",
    userRole: "Öğretmen",
    action: "Yoklama İnceleme",
    category: "attendance",
    description: "9-A sınıfı 1. ders yoklama listesi incelendi ve devamsızlar işaretlendi.",
    status: "success",
    ip: "192.168.1.35"
  }
];

export const INITIAL_NETGSM_SETTINGS = {
  username: "850305XXXX",
  password: "••••••••••••",
  header: "YEMTAL",
  balance: 4250,
  autoSyncMorning: "09:30",
  autoSyncAfternoon: "14:30",
  dlrWebhookUrl: "https://yemtal.meb.k12.tr/api/netgsm-dlr"
};

export const INITIAL_SCHOOL_SETTINGS = {
  name: "Yunus Emre Mesleki ve Teknik Anadolu Lisesi",
  shortName: "YUNUS EMRE MTAL",
  code: "YEMTAL-01",
  email: "idare@yemtal.meb.k12.tr",
  phone: "0 (212) 555 00 00"
};

export const INITIAL_ATTENDANCE = [
  { id: 1, schoolNo: "1042", name: "Ali Emre Kaya", class: "9-A", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Ahmet Kaya (Baba)", parentPhone: "0532 411 22 33", smsStatus: "pending" },
  { id: 2, schoolNo: "1089", name: "Zeynep Sude Yılmaz", class: "9-A", type: "Yarım Gün", typeBadge: "bg-teal-950/60 text-teal-300 border-teal-800", parentName: "Fatma Yılmaz (Anne)", parentPhone: "0544 555 66 77", smsStatus: "pending" },
  { id: 3, schoolNo: "1104", name: "Burak Demir", class: "9-A", type: "Geç Kalma (1. Ders)", typeBadge: "bg-amber-950/60 text-amber-300 border-amber-800", parentName: "Mehmet Demir (Baba)", parentPhone: "0505 123 45 67", smsStatus: "pending" },
  { id: 4, schoolNo: "2130", name: "Ece Naz Öztürk", class: "10-B", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Selin Öztürk (Anne)", parentPhone: "0533 999 88 11", smsStatus: "pending" },
  { id: 5, schoolNo: "2145", name: "Can Polat Aydın", class: "10-B", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Kemal Aydın (Baba)", parentPhone: "0542 333 44 22", smsStatus: "pending" },
  { id: 6, schoolNo: "2178", name: "Merve Çelik", class: "10-B", type: "Yarım Gün", typeBadge: "bg-teal-950/60 text-teal-300 border-teal-800", parentName: "Hülya Çelik (Anne)", parentPhone: "0555 777 88 99", smsStatus: "pending" },
  { id: 7, schoolNo: "2201", name: "Kaan Arslan", class: "10-B", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Bülent Arslan (Baba)", parentPhone: "0536 222 11 00", smsStatus: "pending" },
  { id: 8, schoolNo: "3050", name: "Emirhan Yıldız", class: "11-A", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Osman Yıldız (Baba)", parentPhone: "0541 666 55 44", smsStatus: "pending" },
  { id: 9, schoolNo: "3062", name: "Büşra Doğan", class: "11-A", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Aysel Doğan (Anne)", parentPhone: "0530 888 77 66", smsStatus: "pending" },
  { id: 10, schoolNo: "3081", name: "Batuhan Koç", class: "11-A", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "İsmail Koç (Baba)", parentPhone: "0543 444 33 22", smsStatus: "pending" },
  { id: 11, schoolNo: "3105", name: "İrem Su Karaca", class: "11-A", type: "Yarım Gün", typeBadge: "bg-teal-950/60 text-teal-300 border-teal-800", parentName: "Songül Karaca (Anne)", parentPhone: "0554 222 33 44", smsStatus: "pending" },
  { id: 12, schoolNo: "3120", name: "Görkem Yavuz", class: "11-A", type: "Geç Kalma (1. Ders)", typeBadge: "bg-amber-950/60 text-amber-300 border-amber-800", parentName: "Mustafa Yavuz (Baba)", parentPhone: "0538 555 44 33", smsStatus: "pending" },
  { id: 13, schoolNo: "3144", name: "Melis Şen", class: "11-A", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Ayşe Şen (Anne)", parentPhone: "0535 999 11 22", smsStatus: "pending" },
  { id: 14, schoolNo: "4012", name: "Umut Barış Güler", class: "12-C", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Ramazan Güler (Baba)", parentPhone: "0545 111 22 88", smsStatus: "pending" },
  { id: 15, schoolNo: "4033", name: "Selin Aksoy", class: "12-C", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Nurten Aksoy (Anne)", parentPhone: "0506 333 77 99", smsStatus: "pending" },
  { id: 16, schoolNo: "4055", name: "Furkan Korkmaz", class: "12-C", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Cemal Korkmaz (Baba)", parentPhone: "0531 444 88 55", smsStatus: "pending" },
  { id: 17, schoolNo: "4071", name: "Deniz Erdem", class: "12-C", type: "Yarım Gün", typeBadge: "bg-teal-950/60 text-teal-300 border-teal-800", parentName: "Nilüfer Erdem (Anne)", parentPhone: "0546 222 99 11", smsStatus: "pending" },
  { id: 18, schoolNo: "4090", name: "Efe Berk Tunç", class: "12-C", type: "Tam Gün", typeBadge: "bg-red-950/60 text-red-400 border-red-800", parentName: "Serdar Tunç (Baba)", parentPhone: "0552 888 44 11", smsStatus: "pending" }
];

export const INITIAL_DIRECTORY = [
  { id: 101, schoolNo: "1042", name: "Ali Emre Kaya", class: "9-A", parent1Name: "Ahmet Kaya (Baba)", parent1Phone: "0532 411 22 33", parent2Name: "Sevgi Kaya", parent2Phone: "0532 411 22 34" },
  { id: 102, schoolNo: "1089", name: "Zeynep Sude Yılmaz", class: "9-A", parent1Name: "Fatma Yılmaz (Anne)", parent1Phone: "0544 555 66 77", parent2Name: "-", parent2Phone: "" },
  { id: 103, schoolNo: "1104", name: "Burak Demir", class: "9-A", parent1Name: "Mehmet Demir (Baba)", parent1Phone: "0505 123 45 67", parent2Name: "Hatice Demir", parent2Phone: "0505 123 45 68" },
  // 8 Eksik Kayıt
  { id: 104, schoolNo: "1122", name: "Oğuzhan Kurt", class: "9-A", parent1Name: "Murat Kurt (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "" },
  { id: 105, schoolNo: "1150", name: "Derya Çetin", class: "9-B", parent1Name: "Cevdet Çetin (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "" },
  { id: 106, schoolNo: "2015", name: "Serkan Keskin", class: "10-A", parent1Name: "Nazmi Keskin (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "" },
  { id: 107, schoolNo: "2180", name: "Gizem Güneş", class: "10-B", parent1Name: "Nuran Güneş (Anne)", parent1Phone: "", parent2Name: "", parent2Phone: "" },
  { id: 108, schoolNo: "3022", name: "Halil İbrahim Öz", class: "11-A", parent1Name: "Mahmut Öz (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "" },
  { id: 109, schoolNo: "3110", name: "Aleyna Polat", class: "11-B", parent1Name: "Tülay Polat (Anne)", parent1Phone: "", parent2Name: "", parent2Phone: "" },
  { id: 110, schoolNo: "4019", name: "Kerem Vural", class: "12-A", parent1Name: "Recep Vural (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "" },
  { id: 111, schoolNo: "4064", name: "Hilal Akça", class: "12-C", parent1Name: "Gül Akça (Anne)", parent1Phone: "", parent2Name: "", parent2Phone: "" },
  { id: 112, schoolNo: "2130", name: "Ece Naz Öztürk", class: "10-B", parent1Name: "Selin Öztürk (Anne)", parent1Phone: "0533 999 88 11", parent2Name: "Hakan Öztürk", parent2Phone: "0533 999 88 12" },
  { id: 113, schoolNo: "2145", name: "Can Polat Aydın", class: "10-B", parent1Name: "Kemal Aydın (Baba)", parent1Phone: "0542 333 44 22", parent2Name: "Nermin Aydın", parent2Phone: "0542 333 44 23" }
];

export const SMS_TEMPLATES = [
  { id: "absenteeism", name: "Günlük Devamsızlık Bildirimi", text: "Sayın Velimiz, [Ogrenci_Adi] isimli öğrencimiz [Tarih] tarihinde [Devamsizlik_Turu] olarak okula gelmemiştir. Bilgilerinize rica ederiz. YEMTAL İdaresi" },
  { id: "meeting", name: "Veli Toplantısı Daveti", text: "Sayın Velimiz, genel veli toplantımız bu hafta sonu okulumuz konferans salonunda yapılacaktır. Katılımınızı rica ederiz. YEMTAL Okul Aile Birliği" },
  { id: "exam", name: "Ortak Sınav Takvimi", text: "Sayın Velimiz, 1. dönem ortak yazılı sınavlarımız önümüzdeki hafta başlayacaktır. Ders programına okul sitemizden ulaşabilirsiniz. YEMTAL" }
];

export const INITIAL_EOKUL_STAGING = [
  {
    id: "stg-1",
    schoolNo: "1055",
    name: "Deniz Sarp Karaca",
    class: "10-A",
    attendanceType: "Öğleden Önce Yok",
    detail: "1, 2, 3 ve 4. dersler yok yazıldı (Sabah Yoklaması)",
    parentName: "Metin Karaca (Baba)",
    parentPhone: "0533 111 22 44",
    fetchedAt: "Bugün 14:15",
    smsStatus: "pending",
    isProcessed: true
  },
  {
    id: "stg-2",
    schoolNo: "2088",
    name: "Yağmur Koçak",
    class: "11-B",
    attendanceType: "Tam Gün Yok",
    detail: "Sabah ve Öğleden Sonra tüm dersler yok yazıldı",
    parentName: "Gülşen Koçak (Anne)",
    parentPhone: "0542 666 77 88",
    fetchedAt: "Bugün 14:10",
    smsStatus: "pending",
    isProcessed: true
  },
  {
    id: "stg-3",
    schoolNo: "3142",
    name: "Emre Çakır",
    class: "9-C",
    attendanceType: "Öğleden Sonra Yok",
    detail: "5, 6, 7 ve 8. dersler yok yazıldı (Öğle Sonrası)",
    parentName: "Mustafa Çakır (Baba)",
    parentPhone: "0555 999 00 11",
    fetchedAt: "Bugün 13:50",
    smsStatus: "pending",
    isProcessed: true
  },
  {
    id: "stg-4",
    schoolNo: "4089",
    name: "Beren Yıldırım",
    class: "12-A",
    attendanceType: "Öğleden Önce Yok",
    detail: "1. ve 2. blok derslerde sınıfta bulunamadı",
    parentName: "Süreyya Yıldırım (Anne)",
    parentPhone: "0530 444 33 22",
    fetchedAt: "Bugün 11:30",
    smsStatus: "pending",
    isProcessed: true
  },
  {
    id: "stg-5",
    schoolNo: "1012",
    name: "Yusuf Kerem Aslan",
    class: "10-B",
    attendanceType: "Tam Gün Yok",
    detail: "Tüm gün devamsız (Özürsüz)",
    parentName: "Harun Aslan (Baba)",
    parentPhone: "0536 777 88 99",
    fetchedAt: "Bugün 09:45",
    smsStatus: "pending",
    isProcessed: true
  },
  {
    id: "stg-6",
    schoolNo: "1042",
    name: "Ali Emre Kaya",
    class: "9-A",
    attendanceType: "Tam Gün Yok",
    detail: "Tüm gün yok yazıldı",
    parentName: "Ahmet Kaya (Baba)",
    parentPhone: "0532 411 22 33",
    fetchedAt: "Bugün 09:30",
    smsStatus: "sent",
    sentAt: "Bugün 09:35",
    isProcessed: true
  },
  {
    id: "stg-7",
    schoolNo: "1089",
    name: "Zeynep Sude Yılmaz",
    class: "9-A",
    attendanceType: "Öğleden Sonra Yok",
    detail: "Öğleden sonra 4 ders yok",
    parentName: "Fatma Yılmaz (Anne)",
    parentPhone: "0544 555 66 77",
    fetchedAt: "Bugün 09:30",
    smsStatus: "sent",
    sentAt: "Bugün 09:35",
    isProcessed: true
  },
  {
    id: "stg-8",
    schoolNo: "2130",
    name: "Ece Naz Öztürk",
    class: "10-B",
    attendanceType: "Tam Gün Yok",
    detail: "Tam Gün Özürsüz Devamsızlık",
    parentName: "Selin Öztürk (Anne)",
    parentPhone: "0533 999 88 11",
    fetchedAt: "Bugün 09:20",
    smsStatus: "pending",
    isProcessed: true
  },
  {
    id: "stg-9",
    schoolNo: "3050",
    name: "Emirhan Yıldız",
    class: "11-A",
    attendanceType: "Öğleden Önce Yok",
    detail: "Sabah ilk 4 ders yok",
    parentName: "Osman Yıldız (Baba)",
    parentPhone: "0541 666 55 44",
    fetchedAt: "Bugün 09:15",
    smsStatus: "pending",
    isProcessed: true
  }
];


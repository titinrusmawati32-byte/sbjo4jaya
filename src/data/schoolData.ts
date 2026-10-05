import {
  ExtracurricularItem,
  FacilityItem,
  FAQItem,
  GalleryItem,
  NewsItem,
  PPDBInfo,
  SchoolInfo,
  TeacherItem,
  HeroSlide,
  CoreValueItem,
  HymneInfo,
  SchoolEventItem,
} from '../types';

export const SCHOOL_INFO: SchoolInfo = {
  name: 'SDN SUMBEREJO 04',
  shortName: 'SDN Sumberejo 04',
  npsn: '20512345',
  motto: {
    ID: 'Unggul, Berkarakter, Berbudaya & Peduli Lingkungan',
    EN: 'Excellent, Character-Driven, Cultured & Ecological',
  },
  address: 'Jl. Raya Sumberejo No. 04, Kec. Sumberejo, Kab. Malang, Jawa Timur 65183',
  phone: '+62 819-3377-5547',
  email: 'info@sdnsumberejo04.sch.id',
  whatsapp: '081933775547',
  accreditation: 'A (Unggul) - BAN-S/M Kemendikbudristek RI',
  established: '1982',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=SDN+SUMBEREJO+04&t=&z=16&ie=UTF8&iwloc=&output=embed',
  social: {
    instagram: 'https://instagram.com/sdnsumberejo04',
    facebook: 'https://facebook.com/sdnsumberejo04',
    youtube: 'https://youtube.com/@sdnsumberejo04',
    tiktok: 'https://tiktok.com/@sdnsumberejo04',
    whatsapp: 'https://wa.me/6281933775547',
  },
  vision: {
    ID: 'Menjadi Sekolah Dasar Negeri unggulan yang membentuk generasi cerdas, berkarakter luhur, berbudaya, dan peduli lingkungan.',
    EN: 'To be a premier public elementary school nurturing intelligent, principled, cultured, and eco-conscious students.',
  },
  mission: [
    {
      ID: 'Menyelenggarakan pembelajaran Kurikulum Merdeka yang inovatif, efektif, dan berpusat pada minat serta potensi peserta didik.',
      EN: 'Implement innovative, student-centered learning under the Kurikulum Merdeka curriculum.',
    },
    {
      ID: 'Menanamkan pembiasaan budi pekerti, nilai-nilai Pancasila, kejujuran, dan kedisiplinan dalam kehidupan sehari-hari.',
      EN: 'Instill Pancasila values, integrity, and daily moral discipline in students.',
    },
    {
      ID: 'Mewujudkan sekolah hijau (Adiwiyata) yang bersih, asri, hemat energi, dan bebas sampah plastik.',
      EN: 'Create a clean, green, energy-efficient, and plastic-free eco-friendly school environment.',
    },
    {
      ID: 'Memfasilitasi minat dan bakat siswa melalui program ekstrakurikuler serta bimbingan kompetensi sains dan seni.',
      EN: 'Empower student talents through extracurricular activities and academic/sports coaching.',
    },
  ],
};

export const HYMNE_DATA: HymneInfo = {
  title: 'Mars SDN SUMBEREJO 04',
  composer: 'Tim Pendidik SDN SUMBEREJO 04',
  lyrics: {
    ID: `Derap langkah nan tegas dan pasti,
Putra-putri SDN SUMBEREJO 04 melangkah maju.
Menuntut ilmu demi cita-cita mulia,
Berakhlak luhur, berilmu, dan bertakwa.

Reff:
Bakti kami untuk persada Nusantara,
Menjaga budaya, lestarikan alam nan asri.
Unggul berprestasi, ramah dan santun,
SDN SUMBEREJO 04 jaya sepanjang masa!`,
    EN: `With firm and confident steps,
Students of SDN SUMBEREJO 04 march forward.
Seeking knowledge for noble aspirations,
Guided by morals, wisdom, and faith.

Reff:
Our devotion to the motherland Indonesia,
Preserving culture, safeguarding our green nature.
Striving for excellence with warmth and grace,
SDN SUMBEREJO 04 thrives forevermore!`,
  },
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://drive.google.com/file/d/1X2M4_WZvr7ol-OMlWmMtZ2t9vjujHRmN/view?usp=sharing',
    mediaType: 'video',
    videoUrl: 'https://drive.google.com/file/d/1X2M4_WZvr7ol-OMlWmMtZ2t9vjujHRmN/view?usp=sharing',
    title: {
      ID: 'Kampus Asri & Ramah Anak SDN SUMBEREJO 04',
      EN: 'Serene & Child-Friendly Campus of SDN SUMBEREJO 04',
    },
    subtitle: {
      ID: 'Lingkungan sekolah bersih, hijau, dan kondusif untuk menumbuhkan semangat belajar serta karakter berakhlak mulia.',
      EN: 'A clean, green, and inspiring environment nurturing study passion and noble character.',
    },
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: {
      ID: 'Kurikulum Merdeka & 8 Dimensi Profil Lulusan',
      EN: 'Kurikulum Merdeka & 8 Graduate Profile Dimensions',
    },
    subtitle: {
      ID: 'Mengembangkan 8 Dimensi Profil Lulusan yang terintegrasi dalam kegiatan kokurikuler dan pendekatan pembelajaran mendalam (deep learning) pada setiap mata pelajaran.',
      EN: 'Fostering 8 Graduate Profile Dimensions integrated into co-curricular activities and deep learning approaches.',
    },
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: {
      ID: 'Prestasi Sains, Seni & Olahraga Berkelanjutan',
      EN: 'Sustainable Achievements in Science, Arts & Sports',
    },
    subtitle: {
      ID: 'Mencetak generasi muda SDN SUMBEREJO 04 yang cerdas, mandiri, peduli lingkungan, dan berdaya saing tinggi.',
      EN: 'Shaping a bright generation of SDN SUMBEREJO 04 learners who are smart, independent, and competitive.',
    },
  },
];

export const CORE_VALUES: CoreValueItem[] = [
  {
    id: 'unggul',
    code: 'U',
    title: { ID: 'Unggul & Berprestasi', EN: 'Academic Excellence' },
    desc: {
      ID: 'Semangat belajar tekun, bernalar kritis, dan aktif meraih prestasi di bidang akademik maupun non-akademik.',
      EN: 'Dedicated studying, critical thinking, and striving for excellence in all academic fields.',
    },
    icon: 'Award',
  },
  {
    id: 'karakter',
    code: 'K',
    title: { ID: 'Berkarakter & Jujur', EN: 'Integrity & Character' },
    desc: {
      ID: 'Menanamkan nilai kejujuran, kedisiplinan, kesopanan, dan tanggung jawab dalam setiap perilaku harian.',
      EN: 'Instilling honesty, discipline, respect, and personal responsibility in daily actions.',
    },
    icon: 'ShieldCheck',
  },
  {
    id: 'budaya',
    code: 'B',
    title: { ID: 'Berbudaya & Gotong Royong', EN: 'Cultural & Cooperative' },
    desc: {
      ID: 'Mencintai kebudayaan lokal Jawa Timur dan Nusantara serta menjunjung nilai gotong royong dan kebersamaan.',
      EN: 'Cherishing local heritage, regional arts, and practicing mutual cooperation and unity.',
    },
    icon: 'HeartHandshake',
  },
  {
    id: 'lingkungan',
    code: 'L',
    title: { ID: 'Peduli Lingkungan (Eco-Green)', EN: 'Ecological Care' },
    desc: {
      ID: 'Menjaga kebersihan, penghijauan taman sekolah, pengolahan sampah daur ulang, dan kelestarian alam.',
      EN: 'Maintaining cleanliness, school garden greening, recycling initiatives, and environmental care.',
    },
    icon: 'Sprout',
  },
];

export const PPDB_DATA: PPDBInfo = {
  year: '2027/2028',
  status: 'Buka',
  registrationPeriod: {
    ID: '1 Mei 2027 – 10 Juli 2027 (Jalur Zonasi, Afirmasi & Prestasi)',
    EN: 'May 1, 2027 – July 10, 2027 (Zoning, Affirmation & Achievement Tracks)',
  },
  requirements: [
    {
      ID: 'Calon peserta didik berusia minimal 6 (enam) tahun pada tanggal 1 Juli 2027.',
      EN: 'Prospective students must be at least 6 years old as of July 1, 2027.',
    },
    {
      ID: 'Fotokopi Akta Kelahiran dan Kartu Keluarga (KK) orang tua / wali.',
      EN: 'Copy of Birth Certificate and Family Card (KK).',
    },
    {
      ID: 'Fotokopi Ijazah TK / RA atau Surat Keterangan Lulus (jika ada).',
      EN: 'Copy of Kindergarten Certificate or Graduation Letter (if available).',
    },
    {
      ID: 'Pasfoto berwarna ukuran 3x4 (3 lembar) latar belakang merah.',
      EN: 'Color photograph size 3x4 (3 copies) with red background.',
    },
  ],
  steps: [
    {
      step: 1,
      title: { ID: 'Pendaftaran Daring / Luring', EN: 'Online / Offline Registration' },
      desc: {
        ID: 'Mengisi formulir pendaftaran melalui sistem website ini atau langsung ke loket PPDB sekolah.',
        EN: 'Fill in the admission form via this portal or visit our PPDB desk directly.',
      },
    },
    {
      step: 2,
      title: { ID: 'Penyerahan & Verifikasi Berkas', EN: 'Document Verification' },
      desc: {
        ID: 'Petugas panitia mengunggah dan memverifikasi keabsahan dokumen persyaratan calon siswa.',
        EN: 'Verification committee checks administrative criteria and uploaded documents.',
      },
    },
    {
      step: 3,
      title: { ID: 'Pemetaan Kesiapan Belajar', EN: 'Learning Readiness Mapping' },
      desc: {
        ID: 'Sesi ramah anak untuk pemetaan kemampuan membaca dasar, berhitung, dan sosialisasi.',
        EN: 'A friendly child-centered session mapping basic literacy, numeracy, and social skills.',
      },
    },
    {
      step: 4,
      title: { ID: 'Pengumuman & Daftar Ulang', EN: 'Announcement & Re-registration' },
      desc: {
        ID: 'Pengumuman kelulusan resmi dan proses pendaftaran ulang calon peserta didik baru.',
        EN: 'Official notification of admission results and final re-registration process.',
      },
    },
  ],
};

export const TEACHERS: TeacherItem[] = [
  {
    id: 'pak-bambang',
    name: 'Drs. H. Bambang Setyono, M.Pd.',
    nip: '19680315 199303 1 004',
    role: { ID: 'Kepala Sekolah SDN SUMBEREJO 04', EN: 'School Principal' },
    category: 'pimpinan',
    education: 'S2 Manajemen Pendidikan - Universitas Negeri Malang (UM)',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    quote: {
      ID: 'Pendidikan di SDN SUMBEREJO 04 mengedepankan pembentukan budi pekerti, ilmu pengetahuan, serta kecintaan pada lingkungan.',
      EN: 'Education at SDN SUMBEREJO 04 prioritizes moral character, knowledge, and environmental stewardship.',
    },
  },
  {
    id: 'bu-sri',
    name: 'Hj. Sri Rahayu, S.Pd.',
    nip: '19720820 199803 2 003',
    role: { ID: 'Wakil Kepala Sekolah & Wali Kelas 6', EN: 'Vice Principal & Grade 6 Homeroom' },
    category: 'pimpinan',
    education: 'S1 PGSD - Universitas Brawijaya',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    quote: {
      ID: 'Mengajar dengan kasih sayang dan membimbing anak-anak meraih cita-cita setinggi langit.',
      EN: 'Teaching with affection and guiding children to reach their dreams.',
    },
  },
  {
    id: 'pak-budi',
    name: 'Budi Santoso, S.Pd.',
    nip: '19850412 201001 1 012',
    role: { ID: 'Wali Kelas 5 & Pembina Pramuka', EN: 'Grade 5 Homeroom & Scout Leader' },
    category: 'guru_kelas',
    grade: 'Kelas 5',
    education: 'S1 PGSD - Universitas Negeri Malang',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    quote: {
      ID: 'Disiplin, kebersamaan, dan kepramukaan membentuk karakter kepemimpinan yang tangguh.',
      EN: 'Discipline and scouting build a resilient, strong leadership character.',
    },
  },
  {
    id: 'bu-endang',
    name: 'Endang Sulastri, S.Pd.',
    nip: '19881105 201402 2 006',
    role: { ID: 'Wali Kelas 1 & Guru Tematik Dasar', EN: 'Grade 1 Homeroom Teacher' },
    category: 'guru_kelas',
    grade: 'Kelas 1',
    education: 'S1 PGSD - Universitas PGRI Kanjuruhan Malang',
    photo: 'https://images.unsplash.com/photo-1580894732244-8efe4b1a494f?auto=format&fit=crop&w=600&q=80',
    quote: {
      ID: 'Setiap anak adalah bintang yang unik dan bersinar dengan caranya sendiri yang istimewa.',
      EN: 'Every child is a unique star shining in their own special way.',
    },
  },
  {
    id: 'pak-fauzi',
    name: 'Ahmad Fauzi, S.Pd.I.',
    nip: '19830618 200902 1 005',
    role: { ID: 'Guru Agama Islam & Budi Pekerti', EN: 'Islamic Religion Teacher' },
    category: 'guru_bidang',
    subject: { ID: 'Pendidikan Agama Islam', EN: 'Islamic Studies' },
    education: 'S1 Pendidikan Agama Islam - UIN Maulana Malik Ibrahim',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    quote: {
      ID: 'Pendidikan agama dan budi pekerti adalah fondasi akhlak mulia generasi masa depan.',
      EN: 'Religious education and moral values form the core foundation for noble ethics.',
    },
  },
  {
    id: 'bu-tri',
    name: 'Tri Wahyuni, S.Pd.',
    nip: '19910214 201903 2 011',
    role: { ID: 'Guru Bahasa Inggris & Literasi', EN: 'English & Literacy Specialist' },
    category: 'guru_bidang',
    subject: { ID: 'Bahasa Inggris', EN: 'English Language' },
    education: 'S1 Pendidikan Bahasa Inggris - Universitas Negeri Malang',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    quote: {
      ID: 'Bahasa dan literasi adalah jendela dunia untuk membuka cakrawala wawasan global.',
      EN: 'Language and literacy are the window to the world for global knowledge.',
    },
  },
  {
    id: 'pak-sugeng',
    name: 'Sugeng Supriadi, S.Pd.',
    nip: '19870930 201101 1 009',
    role: { ID: 'Guru PJOK & Pelatih Olahraga', EN: 'Physical Education Teacher' },
    category: 'guru_bidang',
    subject: { ID: 'PJOK / Olahraga', EN: 'Physical Education' },
    education: 'S1 Pendidikan Jasmani - Universitas Negeri Surabaya',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    quote: {
      ID: 'Di dalam tubuh yang sehat dan bugar, terdapat jiwa yang kuat, cerdas, dan penuh wawasan.',
      EN: 'A sound mind rests inside a healthy and active body.',
    },
  },
  {
    id: 'bu-siti',
    name: 'Siti Nurjanah, S.IP.',
    nip: '19940522 202012 2 015',
    role: { ID: 'Kepala Perpustakaan & Arsiparis', EN: 'Head of Library & Records' },
    category: 'staf',
    education: 'S1 Ilmu Perpustakaan - Universitas Brawijaya',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    quote: {
      ID: 'Membaca buku adalah petualangan tanpa batas yang mengasah kecerdasan anak.',
      EN: 'Reading books is an endless adventure sharpening young minds.',
    },
  },
];

export const NEWS_ARTICLES: NewsItem[] = [
  {
    id: 'juara-osn-sd-2026',
    title: {
      ID: 'Siswa SDN SUMBEREJO 04 Sabet Juara 1 OSN Matematika & IPA Tingkat Kabupaten',
      EN: 'SDN SUMBEREJO 04 Student Wins 1st Place in District Science & Math Olympiad',
    },
    summary: {
      ID: 'Prestasi gemilang dipersembahkan oleh Muhammad Rizky (Kelas 5) dalam ajang Olimpiade Sains Nasional (OSN) tingkat SD tahun 2026.',
      EN: 'Outstanding milestone achieved by 5th grader Muhammad Rizky in the National Science Olympiad.',
    },
    content: {
      ID: `Malang - Kabar membanggakan datang dari kontingen sains SDN SUMBEREJO 04. Dalam seleksi final Olimpiade Sains Nasional (OSN) tingkat Sekolah Dasar tahun 2026, siswa kelas 5 Muhammad Rizky berhasil menyabet juara pertama dalam bidang Matematika Terapan dan IPA Dasar.

Kepala Sekolah, Drs. H. Bambang Setyono, M.Pd., mengapresiasi ketekunan siswa serta bimbingan intensif dari tim guru pengajar. "Kemenangan ini membuktikan bahwa anak-anak SDN SUMBEREJO 04 memiliki daya saing tinggi, kerja keras, dan kecerdasan yang luar biasa," tutur beliau.

Peserta didik yang meraih juara ini akan mewakili kabupaten ke tingkat provinsi pada bulan mendatang. Semoga capaian ini memotivasi seluruh siswa SDN SUMBEREJO 04 untuk terus giat belajar dan berprestasi.`,
      EN: `Malang - Pride and joy for the SDN SUMBEREJO 04 delegation! 5th grader Muhammad Rizky won first place in Applied Mathematics & Basic Science at the 2026 National Science Olympiad.`,
    },
    date: '28 Juli 2026',
    category: 'Prestasi',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    author: 'Tim Humas SDN SUMBEREJO 04',
    readTime: '3 menit',
  },
  {
    id: 'gelar-karya-p5-2026',
    title: {
      ID: 'Gelar Karya Kokurikuler SDN SUMBEREJO 04: Pameran 8 Dimensi Profil Lulusan & Pentas Seni Tradisional Memukau',
      EN: 'Co-Curricular Exhibition at SDN SUMBEREJO 04: 8 Graduate Profile Dimensions & Traditional Arts Showcase',
    },
    summary: {
      ID: 'Siswa kelas 1 hingga 6 memamerkan hasil karya ramah lingkungan serta hasil penerapan pembelajaran mendalam (deep learning) pada setiap mata pelajaran.',
      EN: 'Students from Grades 1 to 6 exhibit eco-friendly crafts and deep learning achievements across subjects.',
    },
    content: {
      ID: `Halaman SDN SUMBEREJO 04 tampak meriah dengan berlangsungnya Gelar Karya Kokurikuler & 8 Dimensi Profil Lulusan. Acara ini memamerkan lebih dari 200 produk kerajinan tangan dari bahan daur ulang serta karya inovatif siswa berbasis pendekatan pembelajaran mendalam (deep learning) pada setiap mata pelajaran.

Selain pameran karya, acara juga dimeriahkan dengan pertunjukkan tari tradisional Jawa, ekstrakurikuler drumband nada Sumberejo, serta bazar jajanan sehat hasil olahan wali murid.`,
      EN: `The campus grounds of SDN SUMBEREJO 04 resonated with joy during the Co-Curricular & 8 Graduate Profile Dimensions Exhibition. Over 200 student innovations and deep learning projects were exhibited.`,
    },
    date: '15 Juli 2026',
    category: 'Kegiatan',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80',
    author: 'Hj. Sri Rahayu, S.Pd.',
    readTime: '4 menit',
  },
  {
    id: 'persami-pramuka-2026',
    title: {
      ID: 'Kemah Sabtu-Minggu (Persami) Pramuka Siaga & Penggalang SDN SUMBEREJO 04',
      EN: 'Scout Weekend Camp (Persami) for Siaga & Penggalang at SDN SUMBEREJO 04',
    },
    summary: {
      ID: 'Melatih kemandirian, kedisiplinan, kepemimpinan, dan rasa persaudaraan anggota Pramuka di lingkungan sekolah.',
      EN: 'Fostering self-reliance, discipline, leadership, and fraternity among young scout members.',
    },
    content: {
      ID: `Guna melatih kedisiplinan dan rasa cinta tanah air, Gerakan Pramuka Gugus Depan SDN SUMBEREJO 04 menyelenggarakan kegiatan Kemah Sabtu-Minggu (Persami). Kegiatan diisi dengan penjelajahan alam, latihan tali-temali, api unggun, dan pentas seni antar barung.`,
      EN: `To instill discipline and patriotism, SDN SUMBEREJO 04 Scout Movement organized a Weekend Scouting Camp (Persami).`,
    },
    date: '2 Juli 2026',
    category: 'Kegiatan',
    image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=800&q=80',
    author: 'Budi Santoso, S.Pd.',
    readTime: '2 menit',
  },
  {
    id: 'info-ppdb-sumberejo-2027',
    title: {
      ID: 'Pengumuman Jadwal & Petunjuk Teknis PPDB Tahun Ajaran 2027/2028 SDN SUMBEREJO 04',
      EN: 'Official Admissions Announcement & Technical Guidelines for 2027/2028 Academic Year',
    },
    summary: {
      ID: 'Penerimaan Peserta Didik Baru (PPDB) SDN SUMBEREJO 04 resmi dibuka melalui jalur zonasi, afirmasi, dan prestasi.',
      EN: 'New student admissions (PPDB) for SDN SUMBEREJO 04 are officially open online and offline.',
    },
    content: {
      ID: `Panitia PPDB SDN SUMBEREJO 04 mengumumkan pembukaan pendaftaran peserta didik baru untuk Tahun Ajaran 2027/2028. Orang tua / wali calon murid dapat mendaftar secara langsung di sekretariat sekolah atau melalui portal online ini.

Semua proses pendaftaran PPDB di SDN SUMBEREJO 04 tidak dipungut biaya pendaftaran (gratis) sesuai ketentuan dinas pendidikan nasional.`,
      EN: `The PPDB Committee of SDN SUMBEREJO 04 announces admissions for the 2027/2028 academic year. Admission process is free of registration fees.`,
    },
    date: '20 Juni 2026',
    category: 'Pengumuman',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    author: 'Panitia PPDB SDN SUMBEREJO 04',
    readTime: '3 menit',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: { ID: 'Halaman & Lapangan Utama SDN SUMBEREJO 04', EN: 'Main Field & Campus Courtyard of SDN SUMBEREJO 04' },
    category: 'lingkungan',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
    date: 'Juli 2026',
    description: {
      ID: 'Suasana halaman sekolah yang luas, bersih, dan dipenuhi tanaman hijau nan asri.',
      EN: 'Our spacious, clean, and green campus courtyard for student sports and ceremonies.',
    },
  },
  {
    id: 'gal-2',
    title: { ID: 'Pentas Seni Tari Tradisional Jawa & Nusantara', EN: 'Traditional Dance Performance by Students' },
    category: 'seni',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1000&q=80',
    date: 'Juni 2026',
    description: {
      ID: 'Siswa-siswi ekstrakurikuler tari memperagakan tarian daerah khas Jawa Timur.',
      EN: 'Traditional dance extracurricular students performing East Java regional dances.',
    },
  },
  {
    id: 'gal-3',
    title: { ID: 'Praktikum IPA & Komputer di Lab Sekolah', EN: 'Science & Computer Lab Session' },
    category: 'upacara',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    date: 'Mei 2026',
    description: {
      ID: 'Siswa mempelajari ekosistem tumbuh-tumbuhan dan pengenalan komputer dasar.',
      EN: 'Students exploring botany ecosystems and basic computer operations in the lab.',
    },
  },
  {
    id: 'gal-4',
    title: { ID: 'Pertandingan Futsal & Bola Voli Antar SD', EN: 'Inter-School Futsal & Volleyball Tournament' },
    category: 'olahraga',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    date: 'April 2026',
    description: {
      ID: 'Tim olahraga SDN SUMBEREJO 04 menunjukkan semangat sportivitas dan kekompakan.',
      EN: 'SDN SUMBEREJO 04 sports team displaying sportsmanship and team unity.',
    },
  },
  {
    id: 'gal-5',
    title: { ID: 'Upacara Bendera Hari Senin Khidmat', EN: 'Solemn Monday Flag Ceremony' },
    category: 'upacara',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    date: 'Maret 2026',
    description: {
      ID: 'Upacara rutin setiap hari Senin untuk melatih jiwa patriotisme dan kedisiplinan siswa.',
      EN: 'Weekly flag ceremony nurturing patriotism and discipline among all students.',
    },
  },
  {
    id: 'gal-6',
    title: { ID: 'Atraksi Drumband Nada Sumberejo', EN: 'Nada Sumberejo Drumband Showcase' },
    category: 'seni',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    date: 'Februari 2026',
    description: {
      ID: 'Grup drumband kebanggaan sekolah saat mengisi acara peringatan hari besar nasional.',
      EN: 'Our proud school drumband performing during national celebration day events.',
    },
  },
];

export const FACILITIES: FacilityItem[] = [
  {
    id: 'perpustakaan-taman-ilmu',
    name: { ID: 'Perpustakaan "Taman Ilmu"', EN: '"Taman Ilmu" School Library' },
    category: 'Akademik',
    description: {
      ID: 'Koleksi lebih dari 5.000 buku bacaan anak, ensiklopedia, buku pelajaran Kurikulum Merdeka, serta sudut baca lesehan ber-AC.',
      EN: 'Collection of over 5,000 children books, encyclopedias, and Kurikulum Merdeka textbooks with an AC reading room.',
    },
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    features: [
      { ID: 'Katalog pencarian buku digital', EN: 'Digital book search catalog' },
      { ID: 'Karpet baca lesehan yang nyaman', EN: 'Cozy floor reading area' },
      { ID: 'Koleksi dongeng & cerita rakyat', EN: 'Folk stories & children tales' },
    ],
  },
  {
    id: 'lab-komputer-sains',
    name: { ID: 'Laboratorium Komputer & STEM Dasar', EN: 'Computer & Elementary STEM Lab' },
    category: 'Sains & Tekno',
    description: {
      ID: 'Ruang laboratorium komputer modern ber-AC dengan 25 unit komputer terkoneksi internet aman untuk literasi digital siswa.',
      EN: 'Modern AC computer lab with 25 connected PC units for safe elementary digital literacy.',
    },
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    features: [
      { ID: '25 Unit PC Windows & Proyektor', EN: '25 Windows PCs & HD Projector' },
      { ID: 'Perangkat praktikum IPA dasar', EN: 'Basic science experiment apparatus' },
      { ID: 'Internet sehat berfilter Kemdikbud', EN: 'Filtered safe educational internet' },
    ],
  },
  {
    id: 'lapangan-serbaguna',
    name: { ID: 'Lapangan Serbaguna & Area Bermain', EN: 'Multi-purpose Sports Court & Playground' },
    category: 'Seni & Olahraga',
    description: {
      ID: 'Lapangan luas untuk kegiatan upacara bendera, senam bersama, bola voli, futsal, dan permainan tradisional.',
      EN: 'Spacious court for flag ceremonies, morning gymnastics, volleyball, futsal, and games.',
    },
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    features: [
      { ID: 'Garis lapangan voli & futsal', EN: 'Volleyball & futsal markings' },
      { ID: 'Peralatan olahraga terlengkap', EN: 'Complete sports equipment' },
      { ID: 'Pohon peneduh di sekeliling lapangan', EN: 'Shady trees surrounding field' },
    ],
  },
  {
    id: 'kantin-sehat-uks',
    name: { ID: 'Kantin Sehat & Ruang UKS Terstandar', EN: 'Healthy Canteen & School Clinic (UKS)' },
    category: 'Umum',
    description: {
      ID: 'Kantin bersih yang menyajikan jajanan sehat bebas pengawet serta ruang UKS lengkap dengan tempat tidur periksa.',
      EN: 'Clean canteen serving preservative-free snacks and a fully equipped health clinic room.',
    },
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    features: [
      { ID: 'Pengawasan gizi jajanan rutin', EN: 'Routine snack nutritional checks' },
      { ID: 'Pertolongan pertama (P3K) lengkap', EN: 'Complete first aid kit & beds' },
      { ID: 'Wastafel cuci tangan pakai sabun', EN: 'Handwashing stations with soap' },
    ],
  },
];

export const EXTRACURRICULARS: ExtracurricularItem[] = [
  {
    id: 'pramuka',
    name: { ID: 'Pramuka Siaga & Penggalang', EN: 'Scouts (Siaga & Penggalang)' },
    category: 'Kepemimpinan',
    schedule: { ID: 'Jumat, 13.30 - 15.00 WIB', EN: 'Friday, 13.30 - 15.00 WIB' },
    description: {
      ID: 'Ekstrakurikuler wajib untuk melatih jiwa kepemimpinan, kedisiplinan, kecintaan alam, dan gotong royong.',
      EN: 'Mandatory extracurricular training leadership, discipline, love for nature, and teamwork.',
    },
    image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=600&q=80',
    coach: 'Budi Santoso, S.Pd.',
  },
  {
    id: 'drumband',
    name: { ID: 'Drumband "Nada Sumberejo"', EN: 'Drumband "Nada Sumberejo"' },
    category: 'Seni',
    schedule: { ID: 'Sabtu, 08.00 - 10.00 WIB', EN: 'Saturday, 08.00 - 10.00 WIB' },
    description: {
      ID: 'Melatih ritme musikalitas, kedisiplinan baris-berbaris, dan rasa percaya diri tampil di depan umum.',
      EN: 'Developing musical rhythm, marching discipline, and public performance confidence.',
    },
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    coach: 'Robertus Prasetyo',
  },
  {
    id: 'tari-tradisional',
    name: { ID: 'Seni Tari Tradisional Jawa', EN: 'Traditional Javanese Dance' },
    category: 'Seni',
    schedule: { ID: 'Selasa, 13.30 - 15.00 WIB', EN: 'Tuesday, 13.30 - 15.00 WIB' },
    description: {
      ID: 'Melestarikan tarian khas daerah Jawa Timur dan daerah Nusantara untuk membentuk keluwesan seni.',
      EN: 'Preserving traditional regional dances of East Java and Indonesia.',
    },
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=600&q=80',
    coach: 'Hj. Sri Rahayu, S.Pd.',
  },
  {
    id: 'pencak-silat',
    name: { ID: 'Pencak Silat Tradisional', EN: 'Pencak Silat Martial Arts' },
    category: 'Olahraga',
    schedule: { ID: 'Rabu, 14.00 - 15.30 WIB', EN: 'Wednesday, 14.00 - 15.30 WIB' },
    description: {
      ID: 'Seni bela diri asli Indonesia yang membentuk ketahanan fisik, ketangkasan, serta nilai ksatria.',
      EN: 'Traditional Indonesian martial art building physical agility and noble warrior virtues.',
    },
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
    coach: 'Sugeng Supriadi, S.Pd.',
  },
  {
    id: 'klab-sains',
    name: { ID: 'Klab Sains & Matematika Kreatif', EN: 'Science & Creative Math Club' },
    category: 'Akademik & Sains',
    schedule: { ID: 'Kamis, 13.30 - 15.00 WIB', EN: 'Thursday, 13.30 - 15.00 WIB' },
    description: {
      ID: 'Eksperimen ilmiah seru, pemecahan soal HOTS, serta persiapan lomba OSN Matematika dan IPA.',
      EN: 'Fun scientific experiments, HOTS problem solving, and science olympiad prep.',
    },
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    coach: 'Tri Wahyuni, S.Pd.',
  },
];

export const FREQUENTLY_ASKED_QUESTIONS: FAQItem[] = [
  {
    question: {
      ID: 'Kapan jadwal pendaftaran murid baru (PPDB) SDN SUMBEREJO 04 dibuka?',
      EN: 'When does the new student admission (PPDB) for SDN SUMBEREJO 04 open?',
    },
    answer: {
      ID: 'PPDB SDN SUMBEREJO 04 untuk Tahun Ajaran 2027/2028 dibuka mulai 1 Mei 2027 hingga 10 Juli 2027 melalui jalur Zonasi, Afirmasi, dan Prestasi. Pendaftaran tidak dipungut biaya pendaftaran (gratis).',
      EN: 'Admissions for 2027/2028 open from May 1, 2027 to July 10, 2027 online and offline. Registration is completely free.',
    },
    category: 'PPDB',
  },
  {
    question: {
      ID: 'Apa kurikulum yang diterapkan di SDN SUMBEREJO 04?',
      EN: 'What curriculum is implemented at SDN SUMBEREJO 04?',
    },
    answer: {
      ID: 'SDN SUMBEREJO 04 menerapkan Kurikulum Merdeka secara penuh di seluruh kelas (Kelas 1 hingga 6) yang terintegrasi dengan 8 Dimensi Profil Lulusan dalam kegiatan kokurikuler dan pendekatan pembelajaran mendalam (deep learning) pada setiap mata pelajaran.',
      EN: 'We implement Kurikulum Merdeka across all grades integrated with the 8 Graduate Profile Dimensions in co-curricular activities and deep learning approaches.',
    },
    category: 'Akademik',
  },
  {
    question: {
      ID: 'Apa saja kegiatan ekstrakurikuler di SDN SUMBEREJO 04?',
      EN: 'What extracurricular activities are available at SDN SUMBEREJO 04?',
    },
    answer: {
      ID: 'Kami memiliki ekstrakurikuler unggulan seperti Pramuka Siaga/Penggalang, Drumband Nada Sumberejo, Seni Tari Tradisional Jawa, Pencak Silat, serta Klab Sains & Matematika.',
      EN: 'We offer Scouts, Drumband, Javanese Traditional Dance, Pencak Silat, and Science & Math Club.',
    },
    category: 'Kesiswaan',
  },
  {
    question: {
      ID: 'Apakah pendaftaran siswa di SDN SUMBEREJO 04 dipungut biaya?',
      EN: 'Are there any registration fees for admission to SDN SUMBEREJO 04?',
    },
    answer: {
      ID: 'Tidak. Seluruh proses pendaftaran peserta didik baru (PPDB) di SDN SUMBEREJO 04 adalah GRATIS (bebas biaya pendaftaran).',
      EN: 'No, all new student registration processes at SDN SUMBEREJO 04 are completely free of charge.',
    },
    category: 'PPDB',
  },
];

export const SCHOOL_EVENTS: SchoolEventItem[] = [
  {
    id: 'ev-1',
    title: {
      ID: 'Pekan Peringatan HUT RI ke-81 & Lomba Kreativitas Siswa',
      EN: 'Independence Day Week & Student Competitions',
    },
    category: 'kegiatan',
    dateStart: '2026-08-11',
    dateEnd: '2026-08-15',
    displayDate: '11 - 15 Agustus 2026',
    time: '07.30 - 12.00 WIB',
    location: 'Halaman Utama SDN SUMBEREJO 04',
    target: 'Seluruh Siswa Kelas 1 - 6',
    description: {
      ID: 'Rangkaian kegiatan lomba antar kelas meliputi lomba kebersihan kelas, baca puisi, busana adat, dan olahraga tradisional dalam rangka menyambut HUT Kemerdekaan RI.',
      EN: 'Inter-class competitions celebrating Indonesian Independence Day.',
    },
  },
  {
    id: 'ev-2',
    title: {
      ID: 'Upacara Bendera HUT Kemerdekaan RI ke-81',
      EN: 'Indonesian Independence Day Ceremony',
    },
    category: 'libur',
    dateStart: '2026-08-17',
    displayDate: '17 Agustus 2026',
    time: '07.00 - 09.00 WIB',
    location: 'Lapangan Utama Sekolah',
    target: 'Siswa, Guru, Staff, & Pengurus Komite',
    description: {
      ID: 'Upacara hikmat peringatan Hari Ulang Tahun Kemerdekaan Republik Indonesia ke-81 diikuti seluruh warga sekolah dan pengibaran bendera oleh tim Paskibra siswa.',
      EN: 'Solemn flag ceremony for Indonesian Independence Day.',
    },
  },
  {
    id: 'ev-3',
    title: {
      ID: 'Asesmen Sumatif Tengah Semester (ASTS) Ganjil',
      EN: 'Mid-Semester Examinations',
    },
    category: 'ujian',
    dateStart: '2026-09-01',
    dateEnd: '2026-09-05',
    displayDate: '01 - 05 September 2026',
    time: '07.30 - 11.00 WIB',
    location: 'Ruang Kelas Masing-masing',
    target: 'Siswa Kelas 1 - 6',
    description: {
      ID: 'Evaluasi capaian pembelajaran pertengahan Semester Ganjil Tahun Ajaran 2026/2027 berbasis soal tes diagnostik Kurikulum Merdeka.',
      EN: 'Mid-semester learning assessment for odd semester.',
    },
  },
  {
    id: 'ev-4',
    title: {
      ID: 'Gelar Karya Kokurikuler & 8 Dimensi Profil Lulusan',
      EN: 'Co-Curricular Exhibition & 8 Graduate Profile Dimensions',
    },
    category: 'p5',
    dateStart: '2026-09-25',
    displayDate: '25 September 2026',
    time: '08.00 - 12.30 WIB',
    location: 'Aula & Halaman Sekolah',
    target: 'Siswa, Orang Tua/Wali Murid, & Komite',
    description: {
      ID: 'Pameran hasil karya dan aksi siswa yang mencerminkan 8 Dimensi Profil Lulusan yang terintegrasi dalam kegiatan kokurikuler dan pendekatan pembelajaran mendalam (deep learning) pada setiap mata pelajaran.',
      EN: 'Exhibition of student products reflecting the 8 Graduate Profile Dimensions and deep learning approach.',
    },
  },
  {
    id: 'ev-5',
    title: {
      ID: 'Pertemuan Paguyuban Orang Tua & Laporan Perkembangan Siswa',
      EN: 'Parent-Teacher Consultative Forum',
    },
    category: 'raport',
    dateStart: '2026-10-12',
    displayDate: '12 Oktober 2026',
    time: '09.00 - 11.30 WIB',
    location: 'Aula Pertemuan Sekolah',
    target: 'Orang Tua / Wali Murid Kelas 1 - 6',
    description: {
      ID: 'Forum silaturahmi dan diskusi antara orang tua murid, wali kelas, dan Kepala Sekolah mengenai perkembangan karakter dan akademik peserta didik.',
      EN: 'Consultation and discussion between parents and school leadership.',
    },
  },
  {
    id: 'ev-6',
    title: {
      ID: 'Peringatan Hari Guru Nasional & Pentas Seni Kebudayaan',
      EN: 'National Teachers Day & Cultural Art Show',
    },
    category: 'kegiatan',
    dateStart: '2026-11-25',
    displayDate: '25 November 2026',
    time: '07.30 - 11.30 WIB',
    location: 'Panggung Terbuka Sekolah',
    target: 'Seluruh Keluarga Besar SDN SUMBEREJO 04',
    description: {
      ID: 'Apresiasi untuk bapak/ibu guru disertai penampilan pentas seni tari tradisional, paduan suara, dan drama edukasi oleh para siswa.',
      EN: 'Teacher appreciation day with cultural performances by students.',
    },
  },
  {
    id: 'ev-7',
    title: {
      ID: 'Asesmen Sumatif Akhir Semester (ASAS) Ganjil',
      EN: 'Final Semester Examinations',
    },
    category: 'ujian',
    dateStart: '2026-12-01',
    dateEnd: '2026-12-08',
    displayDate: '01 - 08 Desember 2026',
    time: '07.30 - 11.00 WIB',
    location: 'Ruang Kelas 1 - 6',
    target: 'Siswa Kelas 1 - 6',
    description: {
      ID: 'Ujian akhir semester ganjil untuk mengukur ketuntasan kompetensi kurikulum pembelajaran selama satu semester.',
      EN: 'Final examinations for odd semester.',
    },
  },
  {
    id: 'ev-8',
    title: {
      ID: 'Pembagian Buku Laporan Hasil Belajar (Raport) Semester 1',
      EN: 'First Semester Report Card Distribution',
    },
    category: 'raport',
    dateStart: '2026-12-18',
    displayDate: '18 Desember 2026',
    time: '08.00 - 11.00 WIB',
    location: 'Ruang Kelas Masing-masing Wali Kelas',
    target: 'Orang Tua / Wali Murid',
    description: {
      ID: 'Penyerahan raport hasil belajar Semester Ganjil TA 2026/2027 langsung kepada orang tua/wali murid oleh wali kelas.',
      EN: 'Distribution of semester 1 student progress reports to parents.',
    },
  },
  {
    id: 'ev-9',
    title: {
      ID: 'Libur Semester Ganjil & Libur Akhir Tahun',
      EN: 'First Semester & Year-End Holidays',
    },
    category: 'libur',
    dateStart: '2026-12-21',
    dateEnd: '2027-01-02',
    displayDate: '21 Desember 2026 - 02 Januari 2027',
    time: 'Sepanjang Hari',
    location: 'Libur Sekolah',
    target: 'Seluruh Siswa & Pengajar',
    description: {
      ID: 'Masa libur semester ganjil dan libur tahun baru. Pembelajaran aktif kembali dimulai pada Senin, 04 Januari 2027.',
      EN: 'Mid-year school vacation for students and staff.',
    },
  },
  {
    id: 'ev-10',
    title: {
      ID: 'Awal Masuk Sekolah Semester Genap TA 2026/2027',
      EN: 'First Day of Even Semester',
    },
    category: 'kegiatan',
    dateStart: '2027-01-04',
    displayDate: '04 Januari 2027',
    time: '07.00 WIB',
    location: 'SDN SUMBEREJO 04',
    target: 'Seluruh Siswa & Guru',
    description: {
      ID: 'Hari pertama kegiatan belajar mengajar Semester Genap Dimulai dengan apel kesiapan belajar dan penataan target belajar semester baru.',
      EN: 'First day of school for even semester.',
    },
  },
  {
    id: 'ev-11',
    title: {
      ID: 'Pekan Olahraga & Seni (PORSENI) Tingkat Kecamatan',
      EN: 'Inter-School Sports & Art Festival',
    },
    category: 'kegiatan',
    dateStart: '2027-02-15',
    dateEnd: '2027-02-18',
    displayDate: '15 - 18 Februari 2027',
    time: '08.00 - 14.00 WIB',
    location: 'Gelanggang Olahraga & Sekolah Inti',
    target: 'Kontingen Atlet & Seni Siswa',
    description: {
      ID: 'Ajang seleksi dan perlombaan minat bakat siswa di bidang cabang olahraga atletik, bulutangkis, catur, seni tari, dan menyanyi solo.',
      EN: 'District-level sports and art talent competitions.',
    },
  },
  {
    id: 'ev-12',
    title: {
      ID: 'Sosialisasi & Pembukaan PPDB Tahun Ajaran 2027/2028',
      EN: 'New Student Admission (PPDB) Launch',
    },
    category: 'ppdb',
    dateStart: '2027-03-01',
    displayDate: '01 Maret 2027',
    time: '08.00 - 14.00 WIB',
    location: 'Sekretariat PPDB SDN SUMBEREJO 04 & Online',
    target: 'Calon Wali Murid & Masyarakat',
    description: {
      ID: 'Pembukaan resmi pendaftaran peserta didik baru jalur zonasi, afirmasi, dan perpindahan orang tua untuk tahun ajaran mendatang.',
      EN: 'Official launch for upcoming academic year student admissions.',
    },
  },
];

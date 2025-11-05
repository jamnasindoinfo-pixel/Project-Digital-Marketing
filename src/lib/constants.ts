export const COMPANY_INFO = {
  name: 'PT Jaminan Solusi Bisnis',
  shortName: 'Jaminan Solusi',
  tagline: 'Solusi Lengkap untuk Izin Travel dan Layanan Bisnis',
  description: 'Pendampingan tenaga ahli berpengalaman untuk izin PPIU, PIHK, Akreditasi, IATA, serta layanan administrasi bisnis',
  phone: '+62 812-3456-7890',
  email: 'info@ptjaminansolusibisnis.com',
  address: 'Jl. Contoh Alamat No. 123, Jakarta Pusat, DKI Jakarta 10110',
  whatsapp: '6281234567890',
  experience: '6+',
  clients: '500+',
  projects: '1000+',
  permits: '50+',
}

export const SERVICES = {
  travel: {
    title: 'Layanan Travel',
    icon: 'plane',
    items: [
      {
        id: 'ppiu',
        name: 'PPIU',
        fullName: 'Penyelenggara Perjalanan Ibadah Umrah',
        description: 'Pengurusan izin PPIU lengkap dari awal hingga terbit',
        duration: '60-90 hari',
        benefits: [
          'Pendampingan end-to-end',
          'Review dokumen lengkap',
          'Assistensi verifikasi lapangan',
          'Monitoring progres real-time'
        ],
        features: ['Legalitas PT', 'NIB', 'SOP Layanan', 'SDM Bersertifikat']
      },
      {
        id: 'pihk',
        name: 'PIHK',
        fullName: 'Penyelenggara Ibadah Haji Khusus',
        description: 'Pengurusan izin PIHK untuk travel haji plus',
        duration: '90-120 hari',
        benefits: [
          'Konsultasi persyaratan',
          'Preparasi dokumen',
          'Assistensi wawancara',
          'Follow-up regulasi'
        ],
        features: ['Akreditasi', 'Kerja sama', 'Sistem Informasi', 'Layanan 24/7']
      },
      {
        id: 'akreditasi',
        name: 'Akreditasi',
        fullName: 'Akreditasi PPIU & PIHK',
        description: 'Perpanjangan dan pengurusan akreditasi baru',
        duration: '30-45 hari',
        benefits: [
          'Evaluasi readiness',
          'Gap analysis',
          'Improvement plan',
          'Assistensi audit'
        ],
        features: ['Assessment', 'Training', 'Documentation', 'Certification']
      },
      {
        id: 'iata',
        name: 'IATA',
        fullName: 'Keanggotaan IATA',
        description: 'Konsultasi dan pengurusan keanggotaan IATA',
        duration: '45-60 hari',
        benefits: [
          'Eligibility check',
          'Document preparation',
          'Application support',
          'Post-approval support'
        ],
        features: ['CASS', 'IATAN', 'BSP', 'Financial Guarantee']
      }
    ]
  },
  business: {
    title: 'Layanan Bisnis',
    icon: 'briefcase',
    items: [
      {
        id: 'pajak',
        name: 'Pajak',
        fullName: 'Konsultasi & Pengurusan Pajak',
        description: 'Layanan perpajakan lengkap untuk perusahaan',
        duration: 'Varies',
        benefits: [
          'Tax planning',
          'Compliance check',
          'Tax optimization',
          'Audit support'
        ],
        features: ['SPT Tahunan', 'SPT Masa', 'Restitusi', 'Tax Review']
      },
      {
        id: 'bankGaransi',
        name: 'Bank Garansi',
        fullName: 'Pengajuan Bank Garansi',
        description: 'Berbagai jenis bank garansi untuk proyek',
        duration: '14-21 hari',
        benefits: [
          'Fast approval',
          'Competitive rates',
          'Multiple banks',
          'Full support'
        ],
        features: ['Jaminan Pelaksanaan', 'Jaminan Uang Muka', 'Jaminan Pemeliharaan', 'Retensi']
      },
      {
        id: 'laporanKeuangan',
        name: 'Laporan Keuangan',
        fullName: 'Pembukuan & Laporan Keuangan',
        description: 'Jasa pembukuan dan laporan keuangan profesional',
        duration: 'Monthly',
        benefits: [
          'Accurate reporting',
          'Compliance ready',
          'Business insights',
          'Decision support'
        ],
        features: ['Bookkeeping', 'Financial Statements', 'Tax Reports', 'Management Reports']
      },
      {
        id: 'kontraktor',
        name: 'Kontraktor',
        fullName: 'Administrasi Kontraktor',
        description: 'Layanan administrasi untuk perusahaan kontraktor',
        duration: 'Ongoing',
        benefits: [
          'Project tracking',
          'Cost control',
          'Compliance',
          'Documentation'
        ],
        features: ['SBU', 'IUJK', 'Project Reports', 'Cost Analysis']
      }
    ]
  }
}

export const NAVIGATION = {
  main: [
    { title: 'Home', href: '/' },
    {
      title: 'Layanan',
      href: '/services',
      children: [
        { title: 'PPIU', href: '/services/ppiu', description: 'Izin Penyelenggara Perjalanan Ibadah Umrah' },
        { title: 'PIHK', href: '/services/pihk', description: 'Izin Penyelenggara Ibadah Haji Khusus' },
        { title: 'Akreditasi', href: '/services/akreditasi', description: 'Akreditasi PPIU & PIHK' },
        { title: 'IATA', href: '/services/iata', description: 'Keanggotaan IATA' },
        { title: 'Pajak', href: '/services/pajak', description: 'Konsultasi & Pengurusan Pajak' },
        { title: 'Bank Garansi', href: '/services/bank-garansi', description: 'Pengajuan Bank Garansi' },
        { title: 'Laporan Keuangan', href: '/services/laporan-keuangan', description: 'Pembukuan & Laporan Keuangan' },
        { title: 'Administrasi Kontraktor', href: '/services/kontraktor', description: 'Administrasi Proyek' }
      ]
    },
    { title: 'Blog', href: '/blog' },
    { title: 'Portofolio', href: '/portfolio' },
    { title: 'Testimoni', href: '#testimonials' },
    { title: 'FAQ', href: '#faq' },
    { title: 'Kontak', href: '#cta' }
  ],
  social: [
    { name: 'WhatsApp', href: `https://wa.me/${COMPANY_INFO.whatsapp}` },
    { name: 'Instagram', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'LinkedIn', href: '#' }
  ],
  legal: [
    { name: 'Kebijakan Privasi', href: '/privacy' },
    { name: 'Syarat & Ketentuan', href: '/terms' },
    { name: 'Disclaimer', href: '/disclaimer' }
  ]
}

export const CONTACT_INFO = {
  whatsapp: {
    display: '+62 812-3456-7890',
    link: `https://wa.me/${COMPANY_INFO.whatsapp}`,
    message: 'Halo, saya tertarik dengan layanan PT Jaminan Solusi Bisnis'
  },
  email: {
    display: 'info@ptjaminansolusibisnis.com',
    link: 'mailto:info@ptjaminansolusibisnis.com'
  },
  address: {
    display: COMPANY_INFO.address,
    mapsLink: '#'
  },
  hours: {
    display: 'Senin - Jumat: 09:00 - 17:00 WIB',
    detail: 'Senin - Jumat: 09:00 - 17:00 WIB\nSabtu - Minggu: Tutup'
  }
}

export const FAQ_DATA = {
  travel: [
    {
      question: 'Apa saja syarat utama untuk mengajukan izin PPIU?',
      answer: 'Syarat utama PPIU meliputi: Badan hukum PT, NIB, NPWP, memiliki minimal 2 orang SDM bersertifikat Bimbingan Ibadah Umrah, rekening bank atas nama perusahaan, akta pendirian dan perubahan (jika ada), surat keterangan domisili, dan bukti kepemilikan kantor.',
      category: 'ppiu'
    },
    {
      question: 'Berapa lama proses pengurusan izin PPIU sampai terbit?',
      answer: 'Proses normal PPIU memakan waktu 60-90 hari. Namun dengan pendampingan kami, proses dapat lebih cepat karena dokumen sudah dipersiapkan dengan baik dan sesuai standar Kemenag.',
      category: 'ppiu'
    },
    {
      question: 'Apakah perusahaan saya sudah siap untuk mengajukan PIHK?',
      answer: 'Persyaratan PIHK lebih ketat dari PPIU. Perusahaan harus memiliki pengalaman menyelenggarakan umrah minimal 2 tahun, memiliki minimal 100 jamaah per tahun, dan modal yang lebih besar. Kami dapat melakukan assessment kesiapan perusahaan Anda.',
      category: 'pihk'
    },
    {
      question: 'Kapan akreditasi PPIU harus diperpanjang?',
      answer: 'Akreditasi PPIU harus diperpanjang setiap 3 tahun. Proses perpanjangan sebaiknya dimulai 6 bulan sebelum masa berlaku berakhir untuk menghindari gangguan operasional.',
      category: 'akreditasi'
    },
    {
      question: 'Apa manfaat memiliki keanggotaan IATA untuk travel agent?',
      answer: 'Keanggotaan IATA memberikan akses ke lebih dari 290 maskapai penerbangan, sistem Billing and Settlement Plan (BSP), credibility enhancement, dan kemudahan dalam issuing tiket langsung.',
      category: 'iata'
    }
  ],
  business: [
    {
      question: 'Dokumen apa saja yang diperlukan untuk pengajuan bank garansi?',
      answer: 'Dokumen umum: Akta perusahaan, NIB, NPWP, SPT tahunan 2 tahun terakhir, laporan keuangan 3 bulan terakhir, dokumen proyek (kontrak), dan identitas direksi/komisaris.',
      category: 'bank-garansi'
    },
    {
      question: 'Berapa frekuensi pembukuan yang disarankan untuk perusahaan kecil?',
      answer: 'Untuk perusahaan kecil, disarankan pembukuan bulanan untuk memastikan semua transaksi tercatat dengan baik dan memudahkan pelaporan SPT masa. Pembukuan harian lebih baik jika volume transaksi tinggi.',
      category: 'laporan-keuangan'
    },
    {
      question: 'Kapan waktu terbaik melakukan tax planning?',
      answer: 'Tax planning sebaiknya dilakukan di awal tahun fiskal atau sebelum melakukan transaksi besar. Ini memberikan kesempatan untuk strukturisasi yang optimal dan menghindari pajak yang tidak perlu.',
      category: 'pajak'
    }
  ]
}

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Budi Santoso',
    company: 'PT. Sejahtera Travel',
    position: 'Direktur',
    avatar: '/avatars/testimonial-1.jpg',
    rating: 5,
    service: 'PPIU',
    content: 'Pelayanan sangat memuaskan! Izin PPIU kami terbit dalam 75 hari. Tim yang profesional dan responsif, selalu update progres secara berkala.',
    date: '2024-10-15'
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    company: 'CV. Haji Mabrur',
    position: 'Owner',
    avatar: '/avatars/testimonial-2.jpg',
    rating: 5,
    service: 'PIHK',
    content: 'Alhamdulillah, dengan bantuan PT Jaminan Solusi Bisnis, izin PIHK kami disetujui. Proses yang rumit menjadi mudah dengan pendampingan yang baik.',
    date: '2024-09-20'
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    company: 'PT. Mandiri Konstruksi',
    position: 'Direktur Keuangan',
    avatar: '/avatars/testimonial-3.jpg',
    rating: 5,
    service: 'Bank Garansi',
    content: 'Pengajuan bank garansi untuk proyek kami dipermudah berkat bantuan tim ini. Proses cepat dan persyaratan jelas. Highly recommended!',
    date: '2024-08-10'
  },
  {
    id: 4,
    name: 'Diana Putri',
    company: 'PT. Wisata Nusantara',
    position: 'Operations Manager',
    avatar: '/avatars/testimonial-4.jpg',
    rating: 5,
    service: 'Akreditasi',
    content: 'Akreditasi kami diperpanjang tanpa hambatan. Tim sangat detail dalam mempersiapkan semua dokumen yang diperlukan.',
    date: '2024-11-01'
  },
  {
    id: 5,
    name: 'Rizki Pratama',
    company: 'PT. Solusi Bisnisindo',
    position: 'CEO',
    avatar: '/avatars/testimonial-5.jpg',
    rating: 5,
    service: 'Pajak',
    content: 'Konsultasi pajak sangat membantu perusahaan kami menghemat biaya secara legal. Tim yang ahli dan selalu up-to-date dengan regulasi terbaru.',
    date: '2024-10-28'
  }
]

export const PORTFOLIO = [
  {
    id: 1,
    client: 'PT. Cahaya Hidayah',
    service: 'PPIU',
    category: 'travel',
    duration: '65 hari',
    status: 'completed',
    date: '2024-11-01',
    description: 'Pengurusan izin PPIU baru untuk travel agent di Jakarta',
    image: '/portfolio/ppiu-1.jpg'
  },
  {
    id: 2,
    client: 'CV. Alhijaz Tours',
    service: 'PIHK',
    category: 'travel',
    duration: '105 hari',
    status: 'completed',
    date: '2024-10-25',
    description: 'Pengajuan izin PIHK untuk travel haji plus berpengalaman',
    image: '/portfolio/pihk-1.jpg'
  },
  {
    id: 3,
    client: 'PT. Abadi Konstruksi',
    service: 'Bank Garansi',
    category: 'business',
    duration: '15 hari',
    status: 'completed',
    date: '2024-11-05',
    description: 'Bank garansi untuk proyek konstruksi senilai 5 M',
    image: '/portfolio/bg-1.jpg'
  },
  {
    id: 4,
    client: 'PT. Madani Travel',
    service: 'Akreditasi',
    category: 'travel',
    duration: '35 hari',
    status: 'in-progress',
    date: '2024-11-10',
    description: 'Perpanjangan akreditasi PPIU ketiga',
    image: '/portfolio/akreditasi-1.jpg'
  },
  {
    id: 5,
    client: 'PT. Karya Sejahtera',
    service: 'Laporan Keuangan',
    category: 'business',
    duration: 'Ongoing',
    status: 'active',
    date: '2024-01-01',
    description: 'Jasa pembukuan dan laporan keuangan bulanan',
    image: '/portfolio/keuangan-1.jpg'
  },
  {
    id: 6,
    client: 'PT. Nusantara Jaya',
    service: 'IATA',
    category: 'travel',
    duration: '50 hari',
    status: 'completed',
    date: '2024-09-30',
    description: 'Pengurusan keanggotaan IATA untuk travel agent',
    image: '/portfolio/iata-1.jpg'
  }
]
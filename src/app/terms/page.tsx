import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Shield, Gavel, AlertCircle, DollarSign, Clock } from 'lucide-react'

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: 'Penerimaan Syarat',
      content: 'Dengan mengakses dan menggunakan website kami, Anda menerima dan setuju untuk terikat oleh syarat dan ketentuan ini.'
    },
    {
      icon: Shield,
      title: 'Layanan Kami',
      content: 'Kami menyediakan layanan konsultasi dan pengurusan izin sesuai dengan informasi yang tertera di website. Semua layanan subjek terhadap ketersediaan dan persetujuan pihak berwenang.'
    },
    {
      icon: Gavel,
      title: 'Hak dan Kewajiban',
      content: 'Anda bertanggung jawab untuk keakuratan informasi yang diberikan. Kami berhak menolak layanan jika informasi tidak lengkap atau tidak akurat.'
    },
    {
      icon: AlertCircle,
      title: 'Batasan Tanggung Jawab',
      content: 'Kami tidak bertanggung jawab atas keputusan pihak berwenang terkait aplikasi izin Anda. Layanan kami bersifat konsultasi dan pendampingan.'
    },
    {
      icon: DollarSign,
      title: 'Pembayaran',
      content: 'Semua pembayaran harus dilakukan sesuai dengan kesepakatan. Pembayaran yang telah dilakukan tidak dapat dikembalikan kecuali ada kesalahan dari pihak kami.'
    },
    {
      icon: Clock,
      title: 'Perubahan Syarat',
      content: 'Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku efektif setelah dipublikasikan di website.'
    }
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-16 bg-gradient-to-br from-brand-50 to-white">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Syarat & Ketentuan</h1>
          <p className="text-gray-600 max-w-3xl">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Pendahuluan</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Selamat datang di PT Jaminan Solusi Bisnis. Syarat dan ketentuan ini mengatur penggunaan website
                dan layanan yang kami tawarkan. Dengan menggunakan website kami, Anda setuju untuk terikat oleh
                syarat dan ketentuan ini.
              </p>
            </CardContent>
          </Card>

          {sections.map((section, index) => (
            <Card key={index} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Kontak dan Pertanyaan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>Email: info@ptjaminansolusibisnis.com</li>
                <li>Telepon: +62 812-3456-7890</li>
                <li>Alamat: Jl. Contoh Alamat No. 123, Jakarta Pusat</li>
              </ul>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-brand-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Syarat dan ketentuan ini merupakan perjanjian yang mengikat antara Anda dan PT Jaminan Solusi Bisnis.
              Penggunaan website Anda menunjukkan penerimaan penuh terhadap syarat ini.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
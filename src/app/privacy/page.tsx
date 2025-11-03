import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Database, UserCheck, Globe } from 'lucide-react'

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Shield,
      title: 'Informasi yang Kami Kumpulkan',
      content: 'Kami mengumpulkan informasi pribadi yang Anda berikan secara sukarela saat menggunakan layanan kami, termasuk nama, email, nomor telepon, dan informasi perusahaan.'
    },
    {
      icon: Lock,
      title: 'Penggunaan Informasi',
      content: 'Informasi yang dikumpulkan digunakan untuk menyediakan layanan, menghubungi Anda terkait layanan, dan meningkatkan pengalaman pengguna.'
    },
    {
      icon: Eye,
      title: 'Akses dan Kontrol',
      content: 'Anda berhak mengakses, memperbaiki, atau menghapus informasi pribadi Anda kapan saja dengan menghubungi kami.'
    },
    {
      icon: Database,
      title: 'Penyimpanan Data',
      content: 'Data Anda disimpan dengan aman menggunakan enkripsi dan standar keamanan industri.'
    },
    {
      icon: UserCheck,
      title: 'Berbagi Informasi',
      content: 'Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.'
    },
    {
      icon: Globe,
      title: 'Kebijakan Internasional',
      content: 'Kami mematuhi peraturan privasi internasional termasuk GDPR untuk perlindungan data pengguna global.'
    }
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-16 bg-gradient-to-br from-brand-50 to-white">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Kebijakan Privasi</h1>
          <p className="text-gray-600 max-w-3xl">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Ringkasan Kebijakan Privasi</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Di PT Jaminan Solusi Bisnis, kami berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda.
                Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda
                saat menggunakan website dan layanan kami.
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
              <CardTitle className="text-2xl">Hubungi Kami</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin mengakses, memperbaiki,
                atau menghapus data pribadi Anda, silakan hubungi kami:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>Email: privacy@ptjaminansolusibisnis.com</li>
                <li>Telepon: +62 812-3456-7890</li>
                <li>Alamat: Jl. Contoh Alamat No. 123, Jakarta Pusat</li>
              </ul>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Dengan menggunakan website kami, Anda setuju dengan praktik-praktik yang dijelaskan dalam kebijakan privasi ini.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
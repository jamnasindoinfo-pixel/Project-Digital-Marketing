# 1) Ringkasan Eksekutif

Website perusahaan dengan landing page statis (SEO-ready) dan widget chatbot yang menjawab pertanyaan berbasis RAG dari database internal (dokumen perusahaan). Fokus: cepat online, biaya rendah, aman, bisa dikembangkan bertahap.

---

# 2) Tujuan Produk

* Menyediakan profil perusahaan yang profesional & cepat diakses.
* Menjawab pertanyaan calon klien 24/7 melalui **CS Bot berbasis prompt** (tanpa RAG), dengan jawaban konsisten dari **FAQ/Template internal**.
* **Selalu** menambahkan blok **Benefit + CTA** setelah jawaban untuk mendorong konversi.
* Mendukung **human handoff** (Admin) bila pertanyaan di luar cakupan atau user meminta.

**KPI awal:**

* LCP < 2.5s (p95), Lighthouse Perf > 90, SEO > 90.
* CTR CTA utama > 2%. Bounce rate < 55%.
* > 90% pertanyaan umum terjawab konsisten sesuai FAQ (audit 30 sampel/minggu).

---

# 3) Persona & Use Case

**Persona 1 – Calon Klien**: butuh info layanan, portofolio, prosedur, biaya, kontak.
**Persona 2 – Partner/Instansi**: mencari legalitas, kredensial, dokumen compliance publik.
**Persona 3 – Internal Sales**: menggunakan chatbot untuk Q&A cepat saat call/demo.

Use case inti (dengan dorongan konversi oleh bot):

* **UC-01 (Read → Act)**: Pengunjung membaca ringkas profil & layanan → bot menyisipkan *value proposition* kontekstual + CTA (WhatsApp / Konsultasi Gratis 15 menit).
* **UC-02 (Q&A → Convert)**: User bertanya (mis. "Syarat PPIU?") → bot menjawab **tepat & bersumber** lalu menambahkan **Benefits/Keunggulan** relevan + **CTA** (cek kelayakan gratis / minta checklist PDF / jadwalkan konsultasi).
* **UC-03 (Checklist → Lead)**: Setelah memberikan checklist, bot menawarkan **kirim PDF ke WhatsApp** + **follow-up admin**.
* **UC-04 (Complex → Handoff)**: Pertanyaan kompleks → bot memberi ringkasan, sitasi, dan **ajakan** eskalasi ke Admin.

---

# 4) Lingkup Fitur (MVP)

## 4.1 Landing Page Statis

* **Section**: Hero, Keunggulan/Benefit, Layanan, Portofolio/Klien, Testimoni, FAQ, CTA, Footer.
* **SEO**: meta tags, OG/Twitter cards, sitemap.xml, robots.txt, schema.org (Organization, Service, FAQPage).
* **Analitik**: GA4/Umami, Pixel (opsional), event tracking CTA.

## 4.2 Widget Chatbot (Prompt-Only CS Bot)

* Tombol bubble di kanan-bawah, panel chat, riwayat sesi (localStorage), suggested prompts.
* **Jawaban dari template/FAQ** yang di-*inject* ke prompt LLM; **tanpa pencarian dokumen/Vector DB**.
* Setelah jawaban inti, bot **selalu** menampilkan **Benefit (3–5 poin)** + **CTA** (primer & sekunder) yang relevan dengan intent.
* Guardrails: disclaimer, batasan jawaban, fallback ke human handoff (CTA WhatsApp) bila confidence rendah.

## 4.3 Admin Ringan (Opsional fase 2)

* Dashboard klaim percakapan, rating jawaban, canned responses Admin.
  Admin Ringan (Opsional fase 2)
* Upload dokumen (PDF/DOCX/TXT/CSV/HTML), tag/kategori.
* Riwayat pertanyaan, rating jawaban, umpan balik.

---

# 5) Non-Fungsional

* **Perf**: SSR/SSG, gambar dioptimasi, caching CDN.
* **Keamanan**: sanitasi input, rate limit, API key di server, CORS ketat.
* **Privasi**: pisah koleksi dokumen publik vs internal; untuk publikasi hanya expose ringkasan/snapshot aman.
* **Kepatuhan**: jika memproses data pribadi, tampilkan Privacy Policy & Consent.

---

# 6) Arsitektur & Tech Stack

## 6.1 Frontend

* **Next.js 15 (App Router)** + **React**
* **TailwindCSS** + **shadcn/ui**
* **Static/SSG** untuk halaman marketing; **API Route/Edge** untuk chatbot

## 6.2 Backend Chat (tanpa RAG)

* **LLM Orchestrator**: menyiapkan **system prompt**, memilih **intent**, dan menyisipkan **FAQ/Template** + **benefit & CTA**.
* **Knowledge Source**: file **`faq.json`** (atau Google Sheet) yang dikelola tim.
* **Handoff**: integrasi **WAHA/WhatsApp** atau webchat Admin.

## 6.3 Deployment

* **Web**: Vercel (disarankan) untuk SSG + edge function chatbot.
* **Backend**: bisa tetap di Vercel/Edge atau VPS Hostinger.
* **Tanpa Vector DB**; tidak ada ingestion pipeline.

---

# 7) Desain Data & Orkestrasi Prompt

## 7.1 Struktur FAQ/Template (logical)

```json
{
  "intents": {
    "PPIU_SYARAT": {
      "answer": "Syarat dasar PPIU mencakup legalitas PT, NIB, NPWP, SDM bersertifikat, kerja sama maskapai/hotel, SOP layanan, dan sistem pengaduan.",
      "benefits": [
        "Pendampingan end-to-end hingga terbit",
        "Template dokumen & checklist siap pakai",
        "Review kelayakan cepat dengan rekomendasi",
        "Pengalaman verifikasi lapangan & mitigasi temuan",
        "Laporan progres mingguan + group WA"
      ],
      "cta_primary": "Cek kelayakan gratis via WhatsApp",
      "cta_secondary": "Unduh checklist PPIU (PDF)"
    }
  }
}
```

## 7.2 Alur Orkestrasi

1. **Classify intent** dari pertanyaan (regex/LLM classifier sederhana).
2. Ambil **template** sesuai intent dari `faq.json`.
3. Susun **prompt**: system + gaya + jawaban inti dari template.
4. LLM menghasilkan jawaban yang rapi → **append blok Benefit & CTA** dari template.
5. Jika intent tidak dikenal/ confidence rendah → ajak **handoff ke Admin**.

## 7.3 Pemeliharaan Konten

* `faq.json` dikelola via repo/Notion/Google Sheet → sync cron ke file JSON.
* Review berkala oleh tim konten/lawner (jika menyangkut regulasi).

---

# 8) API Kontrak (MVP)

## POST `/api/chat`

**Req**

```json
{
  "messages": [{"role":"user","content":"Apa syarat PPIU?"}],
  "session_id": "string (optional)",
  "max_tokens": 500
}
```

**Res**

```json
{
  "answer": "string (jawaban inti yang dirapikan)",
  "benefits": ["..."],
  "cta": {"primary":"...","secondary":"..."},
  "usage": {"input_tokens": 1234, "output_tokens": 321},
  "confidence": 0.9,
  "intent": "PPIU_SYARAT"
}
```

## GET `/api/faq`

* Mengembalikan versi & sebagian konten untuk health check (tanpa data sensitif).

## POST `/api/chat/escalate`

* Mengubah mode percakapan menjadi `waiting_admin`, memicu notifikasi (WA/Email/Slack).

---

# 9) UI/UX

* Tombol chat bubble fixed bottom-right.
* Panel: header (logo + status online), area pesan, input + enter to send.
* Placeholder prompt: "Tanyakan apa saja tentang [Nama Perusahaan]".
* Quick prompts: "Layanan kami", "Dokumen yang dibutuhkan", "Kontak tim".
* Pesan pertama bot: salam + disclaimer + tautan CTA human.

---

# 10) Keamanan & Privasi

* **API Keys** hanya di server. Jangan expose di client.
* **Rate limit**: IP + sesi (mis. 60 req/menit burst 10).
* **CORS**: hanya domain produksi.
* **Redaction**: filter PII/rahasia dari jawaban publik.
* **Access control**: koleksi `internal` hanya untuk user login (opsional fase 2).

---

# 11) Observabilitas

* Log pertanyaan/jawaban (hash user anon) + skor confidence + latensi.
* Dashboard sederhana: 10 pertanyaan teratas, precision by tag, dokumen paling sering disitasi.

---

# 12) Roadmap

**MVP (1–2 minggu):**

1. Landing statis, SEO baseline, CTA WhatsApp.
2. Chatbot **prompt-only** (tanpa RAG) + template FAQ + blok Benefit & CTA.
3. Human handoff (WhatsApp deep-link) + status Online/Offline sederhana.

**Phase 2:**

* Admin Console (klaim/reply, rating, canned responses).
* Penyuntingan `faq.json` via panel kecil + versioning.
* Evaluasi intent & CTR CTA otomatis.

**Phase 3:**

* Multilingual, upload file user → jawaban berdasarkan FAQ (bukan RAG).
* Integrasi WhatsApp/WAHA dua arah penuh.

---

# 13) Lingkungan & ENV Example

```
# App
NEXT_PUBLIC_SITE_URL=https://www.domain.com
NODE_ENV=production

# LLM Provider
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=...

# Content
FAQ_SOURCE=file # file|sheet
FAQ_FILE_PATH=./data/faq.json
SHEET_ID=... # jika pakai Google Sheet

# Security
RATELIMIT_WINDOW=60
RATELIMIT_MAX=60
ADMIN_BEARER_TOKEN=supersecret
```

---

# 14) Contoh Struktur Repo (Monorepo opsional)

```
apps/
  web/            # Next.js (landing + widget + API)
  worker/         # ingestion & re-embed cron
packages/
  rag-core/       # fungsi reuse: chunk, embed, retrieve
infrastructure/
  docker/         # qdrant, pgvector, etc.
```

---

# 15) Contoh Kode (Ringkas)

## 15.1 Widget Chat (React client)

```tsx
// app/components/ChatWidget.tsx
'use client'
import { useState, useEffect, useRef } from 'react'

export default function ChatWidget(){
  const [open,setOpen]=useState(false)
  const [input,setInput]=useState('')
  const [msgs,setMsgs]=useState<{role:'user'|'assistant',content:string}[]>([])
  const endRef=useRef<HTMLDivElement>(null)
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])

  async function send(){
    if(!input.trim()) return
    const m=[...msgs,{role:'user',content:input}]
    setMsgs(m); setInput('')
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:m})})
    const data=await res.json()
    const cite = data.citations?.map((c:any)=>`\n\nSumber: ${c.title}`).join('')||''
    setMsgs([...m,{role:'assistant',content:data.answer+cite}])
  }

  if(!open) return <button onClick={()=>setOpen(true)} className="fixed bottom-4 right-4 rounded-full shadow-xl px-4 py-3 bg-black text-white">Chat</button>

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[95vw] rounded-2xl shadow-2xl bg-white border">
      <div className="p-3 border-b flex justify-between items-center"><b>Asisten Perusahaan</b><button onClick={()=>setOpen(false)}>✕</button></div>
      <div className="p-3 h-80 overflow-y-auto space-y-2">
        {msgs.map((m,i)=> (
          <div key={i} className={m.role==='user'? 'text-right':'text-left'}>
            <div className={`inline-block px-3 py-2 rounded-xl ${m.role==='user'?'bg-gray-900 text-white':'bg-gray-100'}`}>{m.content}</div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <div className="p-3 border-t flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Tanyakan apa saja..." className="flex-1 border rounded-xl px-3 py-2"/>
        <button onClick={send} className="px-3 py-2 rounded-xl bg-black text-white">Kirim</button>
      </div>
    </div>
  )
}
```

## 15.2 API Chat (Next.js Route Handler)

````ts
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { classify, loadFAQ, renderAnswer } from '@/lib/csbot'

export async function POST(req: NextRequest){
  const body = await req.json()
  const query = body?.messages?.filter((m:any)=>m.role==='user').pop()?.content || ''
  if(!query) return NextResponse.json({error:'empty'}, { status:400 })

  const faq = await loadFAQ()
  const intent = await classify(query, faq)
  const { answer, benefits, cta, confidence } = await renderAnswer(query, intent, faq)
  return NextResponse.json({ answer, benefits, cta, confidence, intent })
}
```ts
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { retrieve } from '@/lib/rag/retrieve'
import { generate } from '@/lib/rag/generate'

export async function POST(req: NextRequest){
  const body = await req.json()
  const query = body?.messages?.filter((m:any)=>m.role==='user').pop()?.content || ''
  if(!query) return NextResponse.json({error:'empty'}, { status:400 })

  const ctx = await retrieve(query,{ topK: body.top_k ?? 8 }) // returns {chunks:[], citations:[]}
  const answer = await generate(query, ctx.chunks)            // LLM call
  return NextResponse.json({ answer, citations: ctx.citations, confidence: ctx.confidence })
}
````

## 15.3 Retrieve (contoh pseudo)

```ts
// lib/rag/retrieve.ts
export async function retrieve(query:string,{topK=8}:{topK?:number}){
  // 1) embed query → vector
  // 2) search ke Qdrant/Pinecone → topK chunks
  // 3) optional re-rank & scoring
  // 4) susun citations (title, source_url, page)
  return { chunks:[/*...*/], citations:[/*...*/], confidence:0.77 }
}
```

---

# 16) SEO & Konten

* Riset keyword brand + layanan inti; judul H1 mengandung keyword utama.
* Struktur heading teratur (H1-H2-H3), internal link ke halaman layanan.
* Schema.org: `Organization`, `LocalBusiness` (jika relevan), `Service`, `FAQPage`.
* Gambar terkompresi, alt text deskriptif, lazy load.

---

# 17) QA & Uji Penerimaan (MVP)

* Lighthouse Perf/SEO/Best Practices > 90 (desktop & mobile).
* Chatbot mengembalikan 10 pertanyaan uji dengan 70%+ ketepatan + sitasi valid.
* 0 PII bocor pada jawaban publik (uji dengan prompt khusus).
* Rate limit efektif; API tidak merespon untuk domain tak dikenal.

---

# 18) Biaya Perkiraan (bulanan, estimasi)

* Vercel (Hobby/Pro) atau Hostinger static: $0–$20
* VPS (KVM 1 awal): ~Rp 80–150rb/bln
* LLM usage: tergantung pemakaian (awal <$20)
* Domain + email bisnis: $2–$10

> Tidak ada biaya Vector DB karena **tanpa RAG**.

---

# 19) Ekstensi Opsional

* **WAHA/WhatsApp handoff** dari chat (kirim ringkasan ke WA tim)
* **Form lead** ke CRM (Notion/Airtable/HubSpot)
* **PDF viewer** internal dengan watermark & TTL
* **Multibahasa**: id/en otomatis via i18n

---

# 20) Langkah Implementasi Cepat (Checklist)

1. Siapkan repo Next.js + Tailwind + shadcn/ui.
2. Pasang komponen `ChatWidget` & route `/api/chat` (stub balik jawaban dummy).
3. Deploy ke Vercel (landing sudah live).
4. Jalankan worker ingestion untuk 10–20 dokumen kunci → isi vector DB.
5. Sambungkan `retrieve()` ke Qdrant + `generate()` ke LLM → uji 10 pertanyaan.
6. Tambah SEO baseline (sitemap, robots, schema FAQ), hubungkan GA4.
7. Pasang rate limit & logging minimal.
8. Soft launch, kumpulkan feedback, iterasi Phase 2.

---

# 21) CX Chatbot Khusus Kasus PPIU (Customer Service Bot)

## 21.1 Tujuan

* Membuat pengunjung **tertarik untuk bertanya** dan merasa dilayani seperti CS manusia.
* Memberikan **jawaban terstruktur + checklist** untuk perizinan PPIU (tanpa opini hukum), dengan **sitasi sumber**.
* Mengonversi percakapan menjadi **lead berkualitas** (WhatsApp atau form singkat) dengan **ajakan yang selalu relevan**.

## 21.2 Entry Point yang Mengundang Interaksi

* **Hero CTA sekunder**: "Tanya soal izin PPIU" (membuka chat + prefill pertanyaan pertama).
* **Sticky nudge bubble**: balon kecil muncul 8–12 dtk setelah scroll: "Butuh panduan izin PPIU? Klik untuk mulai".
* **Inline FAQ → Chat**: pada section FAQ, tombol "Tanyakan ke Asisten" membuka chat dengan konteks pertanyaan itu.
* **Deep-link query**: `?q=syarat-ppiu` auto-prefill chat; bisa dipakai di kampanye iklan/WA blast.
* **Exit-intent prompt (desktop)**: saat kursor menuju close/tab, tampilkan mini prompt: "Sebelum pergi, mau cek kelayakan PPIU 60 detik?".

## 21.3 Microcopy yang Menjual (contoh)

* Header chat: "Asisten PPIU (Online)" + subline: "Jawaban mengacu dokumen resmi & pengalaman proyek."
* Placeholder: "Tanyakan apa saja tentang perizinan PPIU (syarat, alur, durasi, biaya administrasi, dsb.)."
* Disclaimer ringkas: "Informasi bersifat panduan, bukan nasihat hukum."

## 21.4 Suggested Prompts (One-tap)

* "Apa **syarat dasar** mengajukan izin PPIU?"
* "**Langkah-langkah** pengurusan PPIU dari awal sampai terbit."
* "**Timeline realistis** & tahapan verifikasi lapangan."
* "**Dokumen** apa saja yang harus disiapkan?"
* "**Kesalahan umum** saat pengajuan dan cara menghindarinya."
* "Bagaimana **struktur biaya administratif** (tanpa angka)?"
* "Apa beda **PPIU** dan **PIHK**?"

## 21.5 Alur Percakapan (Flow)

1. **Salam + nilai**: "Halo! Saya Asisten PPIU. Saya bisa bantu menyiapkan checklist dan alur sesuai kondisi perusahaan Anda."
2. **Kualifikasi cepat (3–5 pertanyaan)**: bentuk badan hukum, NPWP/NIB, domisili, pengalaman umrah, kesiapan dokumen.
3. **Jawaban personalisasi**: tampilkan **Checklist** + **Langkah** (bullet) + **Estimasi durasi tiap tahap** + **Sitasi sumber**.
4. **Ajakan berikutnya (selalu hadir)**: blok **Benefit & CTA** yang menonjol (lihat 21.6 Template).
5. **Fallback**: bila confidence < threshold → sampaikan ringkasan + tombol "Hubungi CS" (WhatsApp) + janji tindak lanjut.

## 21.6 Template Jawaban Bot dengan Benefit & CTA (Selalu Ditambahkan)

* **Jawaban inti** (berdasarkan RAG + sitasi).
* **Blok Benefit (3–5 poin)** — contoh untuk layanan PPIU:

  * Pendampingan end-to-end hingga terbit.
  * Template dokumen & checklist siap pakai (menghemat 20–40 jam kerja internal).
  * Review kelayakan cepat (≤ 24 jam kerja) dengan rekomendasi perbaikan.
  * Pengalaman penanganan verifikasi lapangan & mitigasi temuan umum.
  * Laporan progres mingguan + group WA khusus.
* **Social Proof singkat**: logo/angka ringkas (mis. "30+ pengurusan PPIU/PIHK").
* **Risk Reversal**: sesi konsultasi awal gratis 15–30 menit.
* **CTA primer**: "Cek kelayakan gratis" → form 4 field / WhatsApp prefilled.
* **CTA sekunder**: "Unduh checklist PPIU (PDF)" (dengan watermark & tanggal).

> **Catatan**: angka jam/kuota adalah contoh; gunakan konfigurasi Admin agar akurat.

## 21.7 Konten RAG yang Harus Disiapkan

* Ringkasan & kutipan **regulasi Kemenag** terkait PPIU, pedoman teknis/SE, dan alur proses resmi (dokumen publik).
* Template **Checklist PPIU** (versi publik) dengan definisi & contoh bukti.
* **FAQ** umum: perbedaan PPIU/PIHK, dokumen sering salah, tahapan survey, masa berlaku, perubahan data, sanksi.
* **Studi kasus anonim** (opsional) + *lessons learned*.

## 21.8 Guardrails Promosi (Agar Tidak Mengganggu)

* Frekuensi blok Benefit maksimal **1 kali per jawaban**; jika user menolak 2×, tunda 3–5 pesan.
* Gunakan gaya **informational-first**; benefit hanya di bawah jawaban.
* Hindari janji waktu/angka tanpa konfigurasi Admin.

## 21.9 Metrik & Eksperimen

* CTR **CTA primer/sekunder**, scroll-depth panel chat, waktu ke konversi.
* A/B judul blok benefit, urutan poin, dan wording CTA.

---

# 22) Human Handoff ke Admin (Mirip Chat Shopee)

## 22.1 Tujuan

* Memungkinkan pengguna **meminta jawaban dari Admin (manusia)** kapan saja dari dalam widget.
* Menjaga pengalaman mulus: percakapan tetap dalam satu thread; status jelas (Bot ↔ Admin).

## 22.2 UX/Flow

1. **Tombol Escalate** selalu terlihat (mis. "Butuh jawaban Admin?").
2. Saat diklik: tampilkan **pre-check**: jam layanan, estimasi respons, dan pilihan kanal (Tetap di webchat / WhatsApp).
3. Jika pilih **Webchat**:

   * Tampilkan status: **Menunggu Admin** (spinner + nomor antrian opsional).
   * Kirim notifikasi ke dashboard/WA Admin.
   * Saat Admin bergabung: header berubah menjadi **Admin bergabung (nama/admin-id)**, avatar berbeda, label pesan `Admin`.
4. Jika pilih **WhatsApp**:

   * Buat ringkasan percakapan + deep link `wa.me` dengan konteks; tawarkan untuk **kirim transkrip ke WA**.
5. Setelah selesai: minta **rating** (👍/👎 + komentar singkat) dan tawarkan kembali ke Bot.

## 22.3 Komponen UI

* **Status Bar** di header: ● Hijau `Admin Online` / ● Kuning `Estimasi 5–15m` / ● Abu `Di luar jam layanan`.
* **Chip peran**: `Bot`, `Admin`, `User`.
* **Banner eskalasi** jika confidence rendah: "Butuh verifikasi Admin?" (1-tap escalate).

## 22.4 Jam Layanan & Antrian

* Konfigurasi jam: **Sen–Jum 09:00–17:00 WIB** (contoh, bisa diubah ENV).
* Di luar jam: tawarkan **tinggalkan pesan** (nama, WA/email, topik). Notifikasi tetap terkirim; Admin dapat membalas esok hari.
* **Prioritas**: lead dengan skor tinggi (mis. mengetik "siap daftar/kontrak") → antrian prioritas.

## 22.5 Integrasi Teknis

**Pilihan A – Webchat + WAHA (WhatsApp) sebagai notifikasi/handoff**

* Bot mengirim notifikasi ke WA group CS melalui **WAHA API** berisi: link Admin Console, ringkasan pertanyaan, tombol `Bergabung`.
* Admin Console (web) membuka sesi dan mengubah `mode=admin` pada thread.

**Pilihan B – Full WhatsApp Handoff**

* Bot membalas user dengan tombol `Lanjut ke WhatsApp Admin` → deep-link WA berisi ringkasan.
* Opsional: sinkronisasi sebagian pesan ke dashboard (read-only).

## 22.6 Model Data (Sederhana)

```json
{ "Conversation": {
  "id": "uuid",
  "mode": "bot|waiting_admin|admin",
  "user": {"anon_id":"hash","wa":"+62..."},
  "status": "open|pending|closed",
  "priority": 0,
  "created_at": "ISO",
  "updated_at": "ISO"
},
 "Message": {
  "id":"uuid", "conv_id":"uuid", "role":"user|assistant|admin",
  "content":"string", "ts":"ISO"
},
 "Assignment": {"conv_id":"uuid", "agent_id":"uuid", "ts":"ISO"}
}
```

## 22.7 Endpoint & Event

* `POST /api/chat/escalate` → ubah mode `waiting_admin`, kirim notifikasi WA/Email/Slack.
* `POST /api/chat/claim` (admin-only) → klaim percakapan, set `mode=admin`.
* `POST /api/chat/send` (admin-only) → kirim balasan admin.
* Webhook **WAHA** → terima pesan balasan admin bila memakai WhatsApp.
* `POST /api/chat/rate` → simpan rating selesai percakapan.

## 22.8 Admin Console (MVP)

* Login admin (basic auth/jwt) → daftar percakapan `open/pending`.
* Fitur: **claim/release**, **reply**, **templates** (canned responses), **assign ke rekan**, **tutup percakapan**.
* Pencarian percakapan, filter by status/priority.

## 22.9 Keamanan & Kepatuhan

* Audit log: siapa yang klaim/balas/tutup.
* Masking PII saat share ke WA group (opsi).
* Rate limit escalate untuk mencegah spam.

## 22.10 Contoh Microcopy

* **Tombol**: "Butuh jawaban Admin?" / "Chat dengan Admin".
* **Di jam layanan**: "Admin rata-rata membalas dalam 5–15 menit. Ingin lanjut di sini atau via WhatsApp?"
* **Di luar jam layanan**: "Tim kami offline. Tinggalkan kontak, kami follow-up pada hari kerja berikutnya."

## 22.11 Snippet Frontend (status & tombol escalate)

```tsx
function HeaderStatus({online}:{online:boolean}){
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`inline-block w-2 h-2 rounded-full ${online?'bg-green-500':'bg-gray-400'}`}/>
      {online ? 'Admin Online' : 'Di luar jam layanan'}
    </div>
  )
}

function EscalateBar(){
  return (
    <div className="p-2 bg-amber-50 border-t text-sm flex items-center justify-between">
      <span>Perlu verifikasi dari Admin?</span>
      <button className="px-3 py-1 rounded-lg bg-black text-white" onClick={()=>fetch('/api/chat/escalate',{method:'POST'})}>Chat dengan Admin</button>
    </div>
  )
}
```

## 22.12 ENV (Contoh)

```
SUPPORT_HOURS=Mon-Fri 09:00-17:00 Asia/Jakarta
HANDOFF_MODE=webchat|whatsapp|both
WAHA_BASE_URL=...
WAHA_TOKEN=...
ADMIN_CONSOLE_URL=https://admin.domain.com
```

## 22.13 SLA & Metrik

* **SLA internal**: first response < 10 menit (jam kerja), resolve < 1 hari.
* Metrik: jumlah eskalasi/hari, % klaim < 3 menit, CSAT/rating, waktu penyelesaian median.

---

# 23) Backlog Teknis Tambahan

* Intent classifier yang lebih baik (few-shot / pattern map).
* A/B testing microcopy Benefit & CTA per intent.
* PDF generator untuk checklist (server) + kirim via WhatsApp.
* Admin Console: presence, assignment, canned responses, audit log.
* Evaluasi kualitas jawaban (sampling mingguan) + CSAT.

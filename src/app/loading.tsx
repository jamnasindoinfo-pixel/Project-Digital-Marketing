'use client'

import { motion } from 'framer-motion'
import { PageLoading } from '@/components/ui/loading-spinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-bold text-3xl">JSB</span>
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          PT Jaminan Solusi Bisnis
        </h2>

        <p className="text-gray-600 mb-8">
          Solusi Lengkap untuk Izin Travel dan Layanan Bisnis
        </p>

        <PageLoading />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8"
        >
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-brand-600 rounded-full"
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Memuat halaman...
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
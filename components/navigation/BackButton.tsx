'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const BackButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const lang = segments[0]

  const handleBack = () => {
    const path = pathname.split('/')
    path.pop()

    router.push(path.join('/') || `/${lang}`)
  }

  return (
    <button onClick={handleBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
      <ArrowLeft className="w-6 h-6" />
    </button>
  )
}

export default BackButton

'use client'
import { CommunicateProvider } from '@/context/communicate'

export default function CommunicateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <CommunicateProvider>
      { children }
    </CommunicateProvider>
  )
}

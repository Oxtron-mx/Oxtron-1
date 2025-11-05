'use client'
import { AdminAccountProvider } from '@/context/setting/admin-account'

export default function AdminAccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminAccountProvider>
      { children }
    </AdminAccountProvider>
  )
}
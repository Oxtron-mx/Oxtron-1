'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getDictionary } from '@/lib/dictionary'
import { usePathname } from 'next/navigation'
import { Locale } from '@/i18n.config'
import { useCommunicateStore } from '@/store/communicate'
import Report from '@/components/communicate/report'

// ⬇️ Importaciones dinámicas para evitar errores de SSR
const DashboardButton = dynamic(() => import('@/components/DashboardButton'), { ssr: false })
const TableField = dynamic(() => import('@/components/TableField'), { ssr: false })
const TitleHandler = dynamic(() => import('@/components/TitleHandler'), { ssr: false })
const EnvironmentalReport = dynamic(() => import('@/components/communicate/EnvironmentalReport'), { ssr: false })
const CreateReport = dynamic(() => import('@/components/forms/communicate/CreateReport'), { ssr: false })
const Loading = dynamic(() => import('@/components/loading/LoadingBlack'), { ssr: false })
const Modal = dynamic(() => import('@/components/measure/Modal'), { ssr: false })


const Communicate = () => {
  const pathname = usePathname()
  const lang: Locale = (pathname?.split('/')[1] as Locale) || 'en'
  const [loading, setLoading] = useState(true)
  const [dictionary, setDictionary] = useState<any>(null)
  const {
    handleShowCreateReportModal,
    handleHideReportModal,
    showReportModal,
    report,
    setReport,
    downloadReport
  } = useCommunicateStore()

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true)
        const dict = await getDictionary(lang)
        setDictionary(dict.pages.communicate)
      } catch (error) {
        console.error('Error loading dictionary:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDictionary()
  }, [lang])

  if (loading || !dictionary) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading/>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen p-6 lg:ml-[205px] flex flex-col">
        <EnvironmentalReport/>
        <TitleHandler title={ dictionary.title } text={ dictionary.subtitle }/>
        <div className="flex flex-1 gap-10 lg:flex-nowrap flex-wrap mt-4 w-full">
          <div className="bg-white shadow-custom w-full px-7 py-5 flex flex-col justify-between rounded-[8px]">
            <div>
              <h2 className="font-bold text-neutral-700 text-x">{ dictionary.recentReports }</h2>
              <TableField/>
            </div>
            <DashboardButton
              isLoading={ loading }
              className="bg-[#03133A] text-white w-auto max-w-64 mt-10 ml-0"
              onClick={ handleShowCreateReportModal }
            >
              { dictionary.button }
            </DashboardButton>
          </div>
        </div>
        <CreateReport/>
        { showReportModal && report !== null && (
          <Modal className="!w-auto !max-w-[800px] !h-[auto] !max-h-[90vh]" handleOnCloseModal={ () => {
            handleHideReportModal()
            setReport(null)
          } } title={ '' }>
            <Report data={ report }/>
          </Modal>
        ) }
      </div>
      { downloadReport && report !== null && (
        <Report data={ report } pdf={ downloadReport }/>
      ) }
    </>
  )
}

export default Communicate

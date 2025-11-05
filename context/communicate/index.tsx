import { createContext, useState } from 'react'
import {Communicate} from "@/lib/validation";

export interface ICommunicateContext {
  report?: Communicate
  setReport: (report: Communicate) => void
  showReportModal: boolean
  handleHideReportModal: () => void
  handleShowReportModal: () => void
  showCreateReportModal: boolean
  handleHideCreateReportModal: () => void
  handleShowCreateReportModal: () => void
}

export const CommunicateContext = createContext<ICommunicateContext | null>(null);
export const CommunicateProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [report, setReport] = useState<Communicate | undefined>(undefined)
  const [showReportModal, setShowReportModal] = useState<boolean>(false)
  const [showCreateReportModal, setShowCreateReportModal] = useState<boolean>(false)
  const handleHideReportModal = () => setShowReportModal(false)
  const handleShowReportModal = () => setShowReportModal(true)
  const handleHideCreateReportModal = () => setShowCreateReportModal(false)
  const handleShowCreateReportModal = () => setShowCreateReportModal(true)

  return (
    <CommunicateContext.Provider value={ { report, setReport, showReportModal, handleHideReportModal, handleShowReportModal, showCreateReportModal, handleHideCreateReportModal, handleShowCreateReportModal } }>
      { children }
    </CommunicateContext.Provider>
  )
}

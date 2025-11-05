import { create } from 'zustand'
import { Communicate } from '@/lib/validation'
import { createCommunicateReport, fetchRecentReports, getCSV, getPDF, /* getReport, */ getXLSX } from '@/actions/communicate'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

type CommunicateStore = {
  reports: Communicate[],
  report: any | null,
  error: string | null;
  loading: boolean;
  showReportModal: boolean;
  downloadReport: boolean;
  handleHideReportModal: () => void;
  handleShowReportModal: () => void;
  showCreateReportModal: boolean;
  handleHideCreateReportModal: () => void;
  handleShowCreateReportModal: () => void;
  setReports: (reports: Communicate[]) => void;
  setReport: (report: any | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setDownloadReport: (argument: boolean) => void;
  fetchReports: () => Promise<void>;
  fetchReportById: () => Promise<void>;
  createReport: (report: Communicate) => Promise<string | undefined>;
  updateReport: (updatedCommunicate: Communicate) => Promise<string | undefined>;
  deleteReport: (id: number) => Promise<string | undefined>;
  // listReport: (idUserControl: number, startDate: Date, endDate: Date, type: number) => Promise<any>;
  PDF: (idControlCommunicate: number) => Promise<any>;
  XLSX: (idControlCommunicate: number, idUserControl: number) => Promise<any>;
  CSV: (idControlCommunicate: number, idUserControl: number) => Promise<any>;
}

export const useCommunicateStore = create<CommunicateStore>((set) => ({
  reports: [],
  report: null,
  error: null,
  loading: false,
  showReportModal: false,
  showCreateReportModal: false,
  handleHideReportModal: () => set({ showReportModal: false }),
  downloadReport: false,
  handleShowReportModal: () => set({ showReportModal: true }),
  handleHideCreateReportModal: () => set({ showCreateReportModal: false }),
  handleShowCreateReportModal: () => set({ showCreateReportModal: true }),
  setReports: (reports: Communicate[]) => set({ reports }),
  setReport: async (report: any | null) => {
    if (report === null) {
      set({ report: null })
      return;
    }
    const response = await getPDF(report.idControlCommunicate)
    set({ loading: true })
    set({ report: response })
    set({ loading: false })
  },
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setDownloadReport: (argument: boolean) => {
    set({ downloadReport: argument })
  },
  fetchReports: async () => {
    set({ loading: true })
    try {
      const response = await fetchRecentReports()
      set({ reports: response, error: null, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch reports', loading: false })
    }
  },
  fetchReportById: async () => {
    const savedReport = localStorage.getItem('selectedReport')
    if (savedReport) {
      set({ report: JSON.parse(savedReport) })
    }
  },
  createReport: async (report: Communicate) => {
    set({ loading: true })
    try {
      await createCommunicateReport(report)
      const fetchResponse = await fetchRecentReports()

      set({ reports: fetchResponse, showCreateReportModal: false, error: null, loading: false })
      localStorage.removeItem('selectedReport')

      return 'success'
    } catch (error) {
      set({ error: 'Failed to create facility', loading: false })
    }
  },
  updateReport: (report: Communicate) => new Promise<string | undefined>((resolve, reject) => {
  }),
  deleteReport: (id: number) => new Promise<string | undefined>((resolve, reject) => {
  }),
  /* listReport: async (idUserControl: number, startDate: Date, endDate: Date, type: number) => {
    try {
      const response = await getReport(idUserControl, startDate, endDate, type)
      console.log('listReport:', response)
    } catch (error) {
      console.error('listReport', error)
    }
  }, */
  PDF: async (idControlCommunicate: number) => {
    try {
      const response = await getPDF(idControlCommunicate)
      console.log('PDF:', response)
    } catch (error) {
      console.error('PDF:', error)
    }
  },
  XLSX: async (idControlCommunicate: number, idUserControl: number) => {
    try {
      const data = await getXLSX(idControlCommunicate, idUserControl);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No hay datos para exportar');
      }

      const headers = Object.keys(data[0]);
      const orderedData = data.map(item =>
        headers.reduce((obj, key) => {
          obj[key] = item[key];
          return obj;
        }, {} as Record<string, any>)
      );

      const worksheet = XLSX.utils.json_to_sheet(orderedData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, 'reporte.xlsx');
    } catch (error) {
      console.error('XLSX:', error)
    }
  },
  CSV: async (idControlCommunicate: number, idUserControl: number) => {
    try {
      const response = await getCSV(idControlCommunicate, idUserControl)

      if (!response || !Array.isArray(response) || response.length === 0) {
        throw new Error('No hay datos para exportar')
      }

      const headers = Object.keys(response[0])
      const csvHeaders = headers.join(',') + '\n'

      const csvRows = response.map(row =>
        headers.map(header => `"${ row[header] }"`).join(',')
      ).join('\n')

      const csvContent = csvHeaders + csvRows

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, 'reporte.csv')
    } catch (error) {
      console.error('CSV:', error)
    }
  },
}))

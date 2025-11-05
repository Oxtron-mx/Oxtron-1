'use client'
import { useEffect, useRef, useState } from 'react'
// import Image from 'next/image'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useCommunicateStore } from '@/store/communicate'

export default function Report({ data, pdf = false }: { data: any, pdf?: boolean }) {
  const { setDownloadReport } = useCommunicateStore()

  function splitFiscalPeriod(start: string = new Date().toString(), end: string = new Date().toString()) {
    const startDate = new Date(start)
    const endDate = new Date(end)

    const dayStart = startDate.getDate()
    const monthStart = startDate.toLocaleString('es-ES', { month: 'long' })
    const yearStart = startDate.getFullYear()

    const dayEnd = endDate.getDate()
    const monthEnd = endDate.toLocaleString('es-ES', { month: 'long' })
    const yearEnd = endDate.getFullYear()

    return {
      title: 'Inventario de emisiones',
      line1: `Periodo del ${ dayStart } de ${ capitalize(monthStart) }`,
      line2: `${ yearStart } al ${ dayEnd } de ${ capitalize(monthEnd) }`,
      line3: `${ yearEnd } (Año Fiscal ${ yearEnd })`,
    }
  }

  function getFormattedToday() {
    const today = new Date()

    const day = today.getDate().toString().padStart(2, '0')
    const month = today.toLocaleString('es-ES', { month: 'long' })
    const year = today.getFullYear()

    return `${ day } de ${ capitalize(month) }, ${ year }`
  }

  function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const text = splitFiscalPeriod(data?.communicate?.startDate, data?.communicate?.endDate)

  const printRef = useRef<HTMLDivElement | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPdf = () => {
    if (isGenerating || !printRef.current) return

    setIsGenerating(true)
    if (printRef.current) {
      const element = printRef.current

      html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png', 0.7)
        const pdf = new jsPDF('p', 'px', 'a4', true)
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = pageWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let position = 0

        if (imgHeight < pageHeight) {
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        } else {
          let remainingHeight = imgHeight

          while (remainingHeight > 0) {
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            remainingHeight -= pageHeight
            if (remainingHeight > 0) {
              pdf.addPage()
              position = -pageHeight
            }
          }
        }

        pdf.save('Reporte.pdf')
      })

      setDownloadReport(false)
    }
  }

  useEffect(() => {
    if (pdf) handleDownloadPdf()
    pdf = false
  }, [pdf])

  return (
    <div
      className="w-[759px] h-[1072px] mx-auto flex flex-col items-center justify-between"
      ref={ printRef }
    >
      <div
        className="p-[50px] bg-white w-full"
        id="reporte"
      >
        <div className="flex justify-between items-start mb-8 top-0 left-0">
          <div>
            <h1
              style={ { fontFamily: 'Geometos, sans-serif' } }
              className="text-[25px] font-bold uppercase tracking-wide text-[#252733]"
            >
              Reporte de Impacto Ambiental
            </h1>
            <div className="mt-6 grid grid-cols-2 gap-x-16 gap-y-2">
              <div>
                <p className="text-[12px] font-medium text-[#000A14]">
                  { data?.communicate?.organisationName }
                </p>
                <p className="text-[9px] text-[#9FA2B4]">
                  { `${ data?.communicate?.city }, ${ data?.communicate?.state }` }
                </p>
                <p className="text-[9px] text-[#9FA2B4]">
                  { data?.communicate?.country }
                </p>
                <p className="text-[9px] text-[#9FA2B4]">
                  { getFormattedToday() }
                </p>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#000A14]">{ text.title }</p>
                <p className="text-[9px] text-[#9FA2B4]">{ text.line1 }</p>
                <p className="text-[9px] text-[#9FA2B4]">{ text.line2 }</p>
                <p className="text-[9px] text-[#9FA2B4]">{ text.line3 }</p>
                <p className="">{ data.communicate.idFacility }</p>
              </div>
            </div>
          </div>
          {/* <div className="relative w-24 h-24">
            <Image
              src={ data.image }
              alt="Enterprise IMPACT logo"
              width={ 96 }
              height={ 96 }
              className="rounded-full bg-black"
            />
          </div> */}
        </div>

        <section className="mb-8">
          <h4 className="text-[12px] font-bold mb-2 text-[#252733]">
            Impacto Ambiental por Alcances (T/CO₂.)
          </h4>

          { data.reports.map((item: any) => (
            <div className="mb-6">
              {
                /* <>
                  <h3 className="text-md font-medium mb-2 text-gray-900">{ item.alcance }</h3>
                  <hr className="mb-4 bg-[#000A14] h-0.5"/>
                </> */
              }
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="border-b-2 border-[#000A14]">
                    <TableRow>
                      { Object.keys(item)
                        .filter(key => key !== 'id' && key !== 'idUserControl' && key !== 'idControlCommunicate' && key !== 'descripcion')
                        .map((key, index) => (
                          <TableHead
                            key={ key }
                            className={ cn(index === 0 ? 'w-1/3' : 'text-right', 'h-auto !px-0 text-[#000A14] text-[10px] text-xs py-1.5') }
                          >
                            { index === 0 ? item[key] : key }
                          </TableHead>
                        ))
                      }
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      { Object.keys(item)
                        .filter(key => key !== 'id' && key !== 'idUserControl' && key !== 'idControlCommunicate' && key !== 'alcance')
                        .map((key, index) => (
                          <TableCell
                            key={ key }
                            className={ cn(index === 0 ? 'w-1/3' : 'text-right', '!px-0 text-[#9FA2B4] text-[10px] py-1.5') }
                          >
                            { item[key] }
                          </TableCell>
                        ))
                      }
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )) }
        </section>

        <section className="mb-8">
          <h4 className="text-[12px] font-bold mb-2 text-[#252733]">Impacto Ambiental por Sucursal (T/CO₂.)</h4>
          { data.reportDetails.map((item: any) => (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b-2 border-[#000A14]">
                  <TableRow>
                    { Object.keys(item)
                      .filter(key => key !== 'id' && key !== 'idUserControl' && key !== 'idControlCommunicate' && key !== 'descripcion')
                      .map((key, index) => (
                        <TableHead
                          key={ key }
                          className={ cn(index === 0 ? 'w-1/3' : 'text-right', 'h-auto !px-0 text-[#000A14] text-[10px] text-xs py-1.5') }
                        >
                          { key }
                        </TableHead>
                      ))
                    }
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    { Object.keys(item)
                      .filter(key => key !== 'id' && key !== 'idUserControl' && key !== 'idControlCommunicate' && key !== 'alcance')
                      .map((key, index) => (
                        <TableCell
                          key={ key }
                          className={ cn(index === 0 ? 'w-1/3' : 'text-right', '!px-0 text-[#9FA2B4] text-[10px] py-1.5') }
                        >
                          { item[key] }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )) }
        </section>
      </div>
      <footer className="flex items-center justify-between px-[23px] h-[20px] bg-[#000A14] w-[759px] mx-auto border-t border-gray-200 flexgap-4">
        <p className="text-[8px] text-[#EBEDF0] font-extrabold">OXTRON</p>
        <p className="text-[8px] text-[#EBEDF0] font-extrabold">{ new Date().getFullYear() }</p>
      </footer>
    </div>
  )
}


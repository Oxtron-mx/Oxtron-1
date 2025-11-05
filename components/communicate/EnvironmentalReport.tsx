'use client'
import { useContext } from 'react'
import Modal from '@/components/shared/Modal'
import { CommunicateContext, ICommunicateContext } from '@/context/communicate'

const EnvironmentalReport = () => {
  const { showReportModal, handleHideReportModal, report } = useContext(CommunicateContext) as ICommunicateContext

  return (
    <Modal
      open={ showReportModal }
      onClose={ handleHideReportModal }
      className="min-w-[50%] max-w-[50%] portrait:md:min-w-[90%] portrait:md:max-w-[90%] landscape:md:min-w-[50%] landscape:md:max-w-[50%] lg:min-w-[50%] lg:max-w-[80%] xl:min-w-[80%] xl:max-w-[60%] h-[90%]"
    >
      <div className="flex flex-col justify-between items-start p-8 max-w-4xl mx-auto font-sans">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start border-b pb-4 mb-6 gap-5">
          <div className="flex flex-col items-center justify-center md:items-start">
            <h1 className="text-center md:text-start text-2xl font-bold uppercase">Reporte de Impacto Ambiental</h1>
            <p className="text-sm">Waystar, ROYCO</p>
            <p className="text-sm">Fecha: 28/09/2024</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">Inventario de emisiones</p>
            <p className="text-sm">Período anual</p>
            <p className="text-sm">Emisiones por instalaciones</p>
            <p className="text-sm">Gases: CO2, CH4, N2O</p>
          </div>
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <p className="text-white text-sm">Waystar ROYCO</p>
          </div>
        </div>
        <section>
          <h2 className="text-lg font-semibold mb-2">Impacto Ambiental por Alcance (T/CO<sub>2</sub>e)</h2>
          <table className="w-full mb-6 text-sm text-left">
            <thead>
            <tr>
              <th>Alcance</th>
              <th>CO2</th>
              <th>CH4</th>
              <th>N2O</th>
              <th>Biofuel CO2</th>
              <th>Total CO2e</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Alcance 1</td>
              <td>12.00</td>
              <td>0.02</td>
              <td>0.01</td>
              <td>0.00</td>
              <td>12.03</td>
            </tr>
            <tr>
              <td>Alcance 2</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            </tbody>
          </table>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2">Impacto Ambiental por Sucursal (T/CO<sub>2</sub>e)</h2>
          <table className="w-full text-sm text-left">
            <thead>
            <tr>
              <th>Facility ID</th>
              <th>Alcance 1</th>
              <th>Alcance 2</th>
              <th>Alcance 3</th>
              <th>Total CO2e</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Facility 1</td>
              <td>12.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>12.00</td>
            </tr>
            <tr>
              <td>Facility 2</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            </tbody>
          </table>
        </section>
        <footer className="w-full bg-black mt-8 text-xs text-gray-500 text-center">
          <p>© Waystar ROYCO 2024</p>
        </footer>
      </div>
    </Modal>
  )
}

export default EnvironmentalReport
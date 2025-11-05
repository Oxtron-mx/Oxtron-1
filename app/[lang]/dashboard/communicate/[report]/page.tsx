"use client"

import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Report() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900">Reporte de Impacto Ambiental</h1>
          <div className="mt-6 grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
            <div>
              <p className="font-medium text-gray-900">Nexstar IMPACT</p>
              <p className="text-gray-600 text-xs">Reporte del 2023</p>
              <p className="text-gray-600 text-xs">Fecha: 01 de Julio, 2023</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Inventario de emisiones</p>
              <p className="text-gray-600 text-xs">Periodo del 1 de Noviembre</p>
              <p className="text-gray-600 text-xs">2022 al 31 de Octubre</p>
              <p className="text-gray-600 text-xs">2023 (Año Fiscal 2023)</p>
            </div>
          </div>
        </div>
        <div className="relative w-24 h-24">
          <Image
            src="/placeholder.svg?height=96&width=96"
            alt="Nexstar IMPACT logo"
            width={96}
            height={96}
            className="rounded-full bg-black"
          />
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3 text-gray-900">Impacto Ambiental por Alcances (TCO₂e.)</h2>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2 text-gray-900">Alcance 1</h3>
          <hr className="mb-4 bg-[#000A14] h-0.5" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 text-black text-xs py-1.5">Fuente</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">CO₂</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">CH₄</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">N₂O</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">Biofuel CO₂</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">Total CO₂e</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-gray-600 text-xs py-1.5">Combustibles Fósiles</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">5.70</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0.01</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0.03</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">5.74</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-gray-600 text-xs py-1.5">Gas Natural (USA)</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">5.70</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0.01</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0.00</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">5.71</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-gray-600 text-xs py-1.5">Refrigerantes</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="text-gray-900 text-xs py-1.5">Total Alcance 1</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">11.40</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">0.02</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">0.03</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">11.45</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2 text-gray-900">Alcance 2</h3>
          <hr className="mb-4 bg-[#000A14] h-0.5" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 text-black text-xs py-1.5">Fuente</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">CO₂</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">CH₄</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">N₂O</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">Biofuel CO₂</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">Total CO₂e</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-gray-600 text-xs py-1.5">Electricidad (Basado en Mercado)</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">5.08</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">5.08</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-gray-600 text-xs py-1.5">Electricidad (Basado en Ubicación)</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="text-gray-900 text-xs py-1.5">Total Alcance 2</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">5.08</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">5.08</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2 text-gray-900">Alcance 3</h3>
          <hr className="mb-4 bg-[#000A14] h-0.5" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="text-black">
                <TableRow>
                  <TableHead className="w-1/3 text-black text-xs py-1.5">Fuente</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">CO₂</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">CH₄</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">N₂O</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">Biofuel CO₂</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">Total CO₂e</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-gray-600 text-xs py-1.5">Viajes de Negocios</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">25.87</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0.06</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0.80</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">26.73</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-gray-600 text-xs py-1.5">Transporte de Colaboradores</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">25.87</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0.06</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0.80</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">26.73</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-gray-600 text-xs py-1.5">Residuos</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                  <TableCell className="text-right text-gray-600 text-xs py-1.5">-</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="text-gray-900 text-xs py-1.5">Total Alcance 3</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">51.74</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">0.12</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">1.60</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">53.46</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2 text-gray-900">Impacto Total</h3>
          <hr className="mb-4 bg-[#000A14] h-0.5" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 text-black text-xs py-1.5"></TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">CO₂</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">CH₄</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">N₂O</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">Biofuel CO₂</TableHead>
                  <TableHead className="text-right text-black text-xs py-1.5">Total CO₂e</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="font-medium">
                  <TableCell className="text-gray-900 text-xs py-1.5"></TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">68.22</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">0.14</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">1.63</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">0</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs py-1.5">69.99</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2 text-gray-900">Impacto Ambiental por Sourced (TCO₂e.)</h2>
        <hr className="mb-4 bg-[#000A14] h-0.5" />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black text-xs py-1.5">Facility ID</TableHead>
                <TableHead className="text-right text-black text-xs py-1.5">Alcance 1</TableHead>
                <TableHead className="text-right text-black text-xs py-1.5">Alcance 2</TableHead>
                <TableHead className="text-right text-black text-xs py-1.5">Alcance 3</TableHead>
                <TableHead className="text-right text-black text-xs py-1.5">Total CO₂e</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-gray-600 text-xs py-1.5">MX-01</TableCell>
                <TableCell className="text-right text-gray-600 text-xs py-1.5">11.45</TableCell>
                <TableCell className="text-right text-gray-600 text-xs py-1.5">5.08</TableCell>
                <TableCell className="text-right text-gray-600 text-xs py-1.5">53.46</TableCell>
                <TableCell className="text-right text-gray-600 text-xs py-1.5">69.99</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <footer className="mt-16 pt-4 border-t border-gray-200 flex flex-col gap-4">
        <div className="text-xs text-gray-500 flex justify-between">
          <div>© 2023 Nexstar</div>
          <div>Página 1 de 1</div>
        </div>
        <div className="flex justify-between pb-2" style={{ color: "#000A14" }}>
          <div className="text-xs font-medium">OXTRON</div>
          <div className="text-xs font-medium">2023</div>
        </div>
      </footer>
    </div>
  )
}


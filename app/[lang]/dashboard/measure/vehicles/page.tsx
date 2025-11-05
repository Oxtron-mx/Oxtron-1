'use client';
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVehicles } from "@/hooks/measure/vehicles/useVehicles";

// ⬇️ Importaciones dinámicas para evitar errores de SSR (document is not defined)
const Loading = dynamic(() => import("@/components/loading/LoadingBlack"), { ssr: false });
const Modal = dynamic(() => import("@/components/measure/Modal"), { ssr: false });
const TabMenu = dynamic(() => import("@/components/measure/TabMenu"), { ssr: false });
const VehiclesForm = dynamic(() => import("@/components/forms/measure/VehiclesForm"), { ssr: false });


export default function VehiclesPage() {
  const {
    onSubmit,
    loading,
    dictionary,
    vehicle,
    cards,
    brands,
    models,
    types,
    isModelDisabled,
    showModal,
    handleHideModal,
    statuses,
    items,
    buttons,
    form,
  } = useVehicles()
  const path = usePathname()

  return (!dictionary) ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading/>
    </div>
  ) : (
    <>
      <div className="flex flex-col  gap-4 p-6 lg:ml-[205px] ml-0">
        <div>
          <h1 className="title-geometos font-[400] text-2xl text-neutral-300">
            <Link href={path.split('/').slice(0, -1).join('/')}>
              {dictionary?.measure.title}
            </Link> / <span className="text-neutral-900">{dictionary?.measure.all.vehicles}</span>
          </h1>
          <p className="font-light text-neutral-500">
            {dictionary?.measure.subtitle}
          </p>
        </div>
        <TabMenu items={items} cards={cards} iconButton={buttons}/>
      </div>
      {showModal && (
        <Modal title={!vehicle ? dictionary.measure.modalv.create : dictionary.measure.modalv.title} handleOnCloseModal={handleHideModal} className="max-h-[80vh]">
          <VehiclesForm
            vehicle={vehicle}
            loading={loading}
            brands={brands}
            models={models}
            statuses={statuses}
            types={types}
            isModelDisabled={isModelDisabled}
            dictionary={dictionary}
            form={form}
            onSubmit={onSubmit}
          />
        </Modal>
      )}
    </>
  )
}

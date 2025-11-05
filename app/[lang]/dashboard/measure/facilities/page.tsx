'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {useFacilities} from "@/hooks/measure";

// ⬇️ Importaciones dinámicas para evitar errores de SSR
const Loading = dynamic(() => import("@/components/loading/LoadingBlack"), { ssr: false });
const TabMenu = dynamic(() => import("@/components/measure/TabMenu"), { ssr: false });
const Modal = dynamic(() => import("@/components/measure/Modal"), { ssr: false });
const FacilitiesForm = dynamic(() => import("@/components/forms/measure/FacilitiesForm"), { ssr: false });


export default function FacilitiesPage() {
  const {
    loading,
    dictionary,
    items,
    cards,
    buttons,
    showModal,
    handleHideModal,
    facility,
    options,
    onSubmit,
    form
  } = useFacilities();
  const path = usePathname();

  return (loading || !dictionary) ? (
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
            </Link> / <span className="text-neutral-900">{dictionary?.measure.all.facilities}</span>
          </h1>
          <p className="font-light text-neutral-500">
            {dictionary?.measure.subtitle}
          </p>
        </div>
        <TabMenu items={items} cards={cards} iconButton={buttons}/>
      </div>
      {showModal && (
        <Modal title={!facility ? dictionary.measure.modal.create : dictionary.measure.modal.title} handleOnCloseModal={handleHideModal} className="max-h-[80vh]">
          <FacilitiesForm
            loading={loading}
            facility={facility}
            options={options}
            dictionary={dictionary}
            form={form}
            onSubmit={onSubmit}
          />
        </Modal>
      )}
    </>
  )
}

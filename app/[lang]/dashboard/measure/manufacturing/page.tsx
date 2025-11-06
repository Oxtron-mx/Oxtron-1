'use client'

import {useManufacturing} from "@/hooks/measure/manufacturing/useManufaturing";
import { getEmissionFactorSubtypes } from "@/services/CatalogService";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ⬇️ Importaciones dinámicas para evitar errores de SSR (document is not defined)
const Loading = dynamic(() => import("@/components/loading/LoadingBlack"), { ssr: false });
const Modal = dynamic(() => import("@/components/measure/Modal"), { ssr: false });
const TabMenu = dynamic(() => import("@/components/measure/TabMenu"), { ssr: false });
const ManufacturingForm = dynamic(() => import("@/components/forms/measure/ManufacturingForm"), { ssr: false });




export default function ManufacturingPage() {
  const {
    dictionary,
    loading,
    items,
    cards,
    buttons,
    manufacture,
    showModal,
    handleHideModal,
    facilityOptions,
    fuelOptions,
    equipmentOptions,
    form,
    onSubmit,
  } = useManufacturing();
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
            </Link> / <span className="text-neutral-900">{dictionary?.measure.all.manufacturing}</span>
          </h1>
          <p className="font-light text-neutral-500">
            {dictionary?.measure.subtitle}
          </p>
        </div>
        <TabMenu items={items} cards={cards} iconButton={buttons}/>
      </div>
      {showModal && (
        <Modal title={!manufacture ? dictionary.measure.modalm.create : dictionary.measure.modalm.title} handleOnCloseModal={handleHideModal} className="max-h-[80vh]">
          <ManufacturingForm
            manufacturing={manufacture}
            loading={loading}
            equipmentOptions={equipmentOptions}
            facilityOptions={facilityOptions}
            fuelOptions={fuelOptions}
            dictionary={dictionary?.measure.modalm}
            form={form}
            onSubmit={onSubmit}
          />
        </Modal>
      )}
    </>
  )
}

'use client'
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCommuting } from "@/hooks/measure/commuting/useCommuting";

// ⬇️ Importaciones dinámicas para evitar errores de SSR (document is not defined)
const Loading = dynamic(() => import("@/components/loading/LoadingBlack"), { ssr: false });
const TabMenu = dynamic(() => import("@/components/measure/TabMenu"), { ssr: false });
const Modal = dynamic(() => import("@/components/measure/Modal"), { ssr: false });
const CommutingForm = dynamic(() => import("@/components/forms/measure/CommutingForm"), { ssr: false });


export default function CommutingPage() {
  const {
    dictionary,
    commute,
    loading,
    facilityOptions,
    onSubmit,
    items,
    cards,
    buttons,
    showModal,
    form,
    handleHideModal
  } = useCommuting()
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
            </Link> / <span className="text-neutral-900">{dictionary?.measure.all.commuting}</span>
          </h1>
          <p className="font-light text-neutral-500">
            {dictionary?.measure.subtitle}
          </p>
        </div>
        <TabMenu items={items} cards={cards} iconButton={buttons}/>
      </div>
      {showModal && (
        <Modal title={commute ? dictionary.measure.modalc.title : dictionary.measure.modalc.create} handleOnCloseModal={handleHideModal} className="max-h-[80vh]">
          <CommutingForm
            loading={loading}
            commuting={commute}
            options={facilityOptions}
            dictionary={dictionary?.measure.modalc}
            form={form}
            onSubmit={onSubmit}
          />
        </Modal>
      )}
    </>
  )
}

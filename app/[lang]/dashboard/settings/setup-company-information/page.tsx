'use client'

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SquarePen } from 'lucide-react';
import { getCompanyById } from '@/actions/company';
import {getCboRoles, getUserBySession} from '@/actions/auth';
import { Company, UpdateUser } from '@/lib/validation';
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores en SSR
import dynamic from 'next/dynamic';
import {ComboRole} from "@/constants/types";
import BackButton from "@/components/navigation/BackButton";

const TitleHandler = dynamic(() => import('@/components/TitleHandler'), { ssr: false });
const Loading = dynamic(() => import('@/components/loading/LoadingBlack'), { ssr: false });
const Modal = dynamic(() => import("@/components/shared/Modal"), { ssr: false });
const EditCompanyForm = dynamic(() => import("@/components/forms/settings/setup/EditCompanyForm"), { ssr: false });
const EditUserForm = dynamic(() => import("@/components/forms/settings/setup/EditUserForm"), { ssr: false });



const Setup = () => {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [companyData, setCompanyData] = useState<Company>()
  const [userData, setUserData] = useState<UpdateUser>()
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);
  const [role, setRole] = useState<ComboRole>()

  const handleCompanyEditClick = () => {
    setIsCompanyModalOpen(true)
  }

  const handleUserEditClick = () => {
    setIsUserModalOpen(true)
  }

  const handleCloseCompanyModal = () => {
    setIsCompanyModalOpen(false)
  }

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false)
  }

  const loadData = async () => {
    try {
      const user = await getUserBySession()
      const company = await getCompanyById(user.idCompany)
      const roles = await getCboRoles();

      setRole(roles.find((role) => user.idUSerType === role.idCatRole))
      setCompanyData(company)
      setUserData(user as unknown as UpdateUser)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings.setup);
        await loadData();
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  if (loading || !dictionary) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 lg:ml-6 ml-0 min-h-screen flex flex-col pb-10 md:pl-64">
      <div className="flex items-center mb-4 gap-2">
        <BackButton/>
        <TitleHandler title={dictionary.company} text={dictionary.manage}/>
      </div>
      <div className="flex flex-col md:flex-row gap-10 mt-4 flex-1 w-full pb-9">
        {/* Contenedor 1 */ }
        <div className="relative bg-white shadow-xl w-full md:w-1/2 px-7 py-5 grid rounded-xl">
          <div className="absolute top-2 right-2">
            <SquarePen size={ 15 } className="text-neutral-500 cursor-pointer" onClick={ handleCompanyEditClick }/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-neutral-400 text-xs mb-1">{dictionary.content1.name}</p>
                <h2 className="font-bold text-neutral-700 text-h1">{ companyData?.organisatioName }</h2>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content1.industry}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ companyData?.industry }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content1.country}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ companyData?.country }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content1.state}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ companyData?.state }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content1.city}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ companyData?.city }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content1.zip}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ companyData?.postalCode }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content1.add}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ companyData?.address }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content1.phone}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ companyData?.telephoneCompany }</h2>
            </div>
          </div>
        </div>
        {/* Contenedor 2 */ }
        <div className="relative bg-white shadow-xl w-full md:w-1/2 px-7 py-5 grid rounded-xl">
          <div className="absolute top-2 right-2">
            <SquarePen size={ 15 } className="text-neutral-500 cursor-pointer" onClick={ handleUserEditClick }/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-neutral-400 text-xs mb-1">{dictionary.content2.name}</p>
                <h2 className="font-bold text-neutral-700 text-h1">{ userData?.firstName }</h2>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content2.sur}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ userData?.lastName }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content2.user}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ role?.description }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content2.email}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ userData?.email }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content2.role}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ userData?.role }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content2.pass}</p>
              <h2 className="font-bold text-neutral-700 text-h1">********</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content2.phone}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ userData?.telephoneUser }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content2.zone}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ userData?.timeZone }</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">{dictionary.content2.lang}</p>
              <h2 className="font-bold text-neutral-700 text-h1">{ userData?.language }</h2>
            </div>
          </div>
        </div>
      </div>
      {isCompanyModalOpen && (
        <Modal open={isCompanyModalOpen} onClose={handleCloseCompanyModal} className="!h-auto">
          <EditCompanyForm company={companyData} loadData={loadData} onClose={handleCloseCompanyModal}/>
        </Modal>
      )}
      {isUserModalOpen && (
        <Modal open={isUserModalOpen} onClose={handleCloseUserModal} className="max-h-[80vh]">
          <EditUserForm user={userData} company={companyData} loadData={loadData} onClose={handleCloseUserModal}/>
        </Modal>
      )}
    </div>
  )
}

export default Setup

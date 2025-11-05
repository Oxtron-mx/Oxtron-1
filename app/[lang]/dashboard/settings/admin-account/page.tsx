'use client'
import { useContext, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

// ⬇️ Importaciones dinámicas para evitar errores de SSR
const DashboardButton = dynamic(() => import('@/components/DashboardButton'), { ssr: false });
const UserByCompanyIdForm = dynamic(() => import('@/components/forms/settings/admin/UserByCompanyIdForm'), { ssr: false });
const EditUserForm = dynamic(() => import('@/components/forms/settings/admin/EditUserForm'), { ssr: false });
const TableAdmin = dynamic(() => import('@/components/TableAdmin'), { ssr: false });
const TitleHandler = dynamic(() => import('@/components/TitleHandler'), { ssr: false });
const Modal = dynamic(() => import('@/components/shared/Modal'), { ssr: false });
const Loading = dynamic(() => import('@/components/loading/LoadingBlack'), { ssr: false });

import { AdminAccountContext, IAdminAccountContext } from '@/context/setting/admin-account';
import { getDictionary } from '@/lib/dictionary';
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n.config';
import BackButton from "@/components/navigation/BackButton";

const AdminPage: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    isLoading,
    handleOpenRegisterUserModal,
    handleCloseRegisterUserModal,
    isRegisterUserModalOpen,
    isUpdateUserModalOpen,
    handleCloseUpdateUserModal,
  } = useContext(AdminAccountContext) as IAdminAccountContext
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings.admin);
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
    <div className='p-6 lg:ml-[205px] ml-0 min-h-screen pb-10 mt-6 md:ml-[205px] flex flex-col'>
      <div className='flex items-center mb-4 gap-2'>
        <BackButton/>
        <TitleHandler title={dictionary.admin} text={dictionary.subtitle} />
      </div>
      <div className='flex flex-1 gap-10 md:flex-nowrap flex-wrap mt-4 w-full'>
        <div className='bg-white shadow-xl w-full px-7 py-8 flex flex-col rounded-xl max-h-[550px]'>
          <h2 className='font-bold text-neutral-700 text-xl'>{dictionary.manager}</h2>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='relative mt-7'>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='border border-gray-300 rounded-md px-3 py-2 pl-10 pr-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
            </div>
            <div className='hidden md:block md:mt-7'>
              <DashboardButton
                isLoading={isLoading}
                style={{
                  background: 'linear-gradient(to top, #2A8CFE, #03133A)',
                  fontFamily: 'font-sans, sans-serif',
                  padding: '23px',
                  textTransform: 'none',
                }}
                onClick={handleOpenRegisterUserModal}
              >
                <h2 className='font-bold text-white text-md'>
                  {dictionary.button}
                </h2>
              </DashboardButton>
            </div>
          </div>
          <TableAdmin/>
        </div>
      </div>

      {/* Renderiza el Modal */}
      { isRegisterUserModalOpen && (
        <Modal open={isRegisterUserModalOpen} onClose={handleCloseRegisterUserModal} title={dictionary.modal.title} className="h-[80vh]">
          <UserByCompanyIdForm/>
        </Modal>
      )}
      { isUpdateUserModalOpen && (
        <Modal open={isUpdateUserModalOpen} onClose={handleCloseUpdateUserModal} title={dictionary.modal.edit}>
          <EditUserForm/>
        </Modal>
      )}
    </div>
  );
}

export default AdminPage;

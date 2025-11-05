import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TrashIcon, UserIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { IUser } from '@/constants/types'
import { ActivityIcon } from 'lucide-react'
import { Dialog } from '@/components/shared/AlertDialog'
import { deleteUserById, disableUserById } from '@/actions/auth'
import { useToast } from '@/components/ui/use-toast'
import { AdminAccountContext, IAdminAccountContext } from '@/context/setting/admin-account'
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";
import Loading from '@/components/loading/LoadingBlack';

interface TableAdminProps {}

const TableField: React.FC<TableAdminProps> = () => {
  const { setUser, searchTerm, handleOpenUpdateUserModal, loadData, data, company } = React.useContext(AdminAccountContext) as IAdminAccountContext
  const { toast } = useToast()
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
        await loadData()
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

  const filteredData = data.filter(user =>
    `${ user.firstName } ${ user.lastName }`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deleteUser = async (idUserControl: number) => {
    try {
      const response = await deleteUserById(idUserControl)
      if (response.success) {
        toast({
          title: dictionary.table.success, 
          description: dictionary.table.other,
          className: 'bg-black',
        })
        await loadData()
      }
    } catch (error) {
      toast({
        title: dictionary.table.error,
        description: dictionary.table.descript,
        className: 'bg-black',
      })
      console.error({ error })
    }
  }

  const disableUser = async (idUserControl: number) => {
    try {
      const response = await disableUserById(idUserControl)
      if (response.success) {
        toast({
          title: dictionary.table.success, 
          description: dictionary.table.description,
          className: 'bg-black',
        })

        loadData()
      }
    } catch (error) {
      toast({
        title: dictionary.table.error,
        description: dictionary.table.descript,
        className: 'bg-black',
      })
      console.error({ error })
    }
  }

  const editUser = (user: IUser) => {
    handleOpenUpdateUserModal()
    setUser(user)
  }

  return (
    <div className="mt-7">
      <Table style={ { color: '#9FA2B4' } }>
        <TableHeader>
          <TableRow style={ { color: '#9FA2B4', fontSize: '11px' } }>
            <TableHead>{dictionary.table.organization}</TableHead>
            <TableHead className="hidden md:table-cell">{dictionary.table.name}</TableHead>
            <TableHead className="hidden md:table-cell">{dictionary.table.email}</TableHead>
            <TableHead className="hidden md:table-cell">{dictionary.table.status}</TableHead>
            <TableHead>{dictionary.table.options}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { filteredData.map((user, index) => (
            <TableRow key={ index }>
              <TableCell className="font-medium">{ company?.organisatioName }</TableCell>
              <TableCell className="hidden md:table-cell">{ `${ user.firstName } ${ user.lastName }` }</TableCell>
              <TableCell className="hidden md:table-cell">{ user.email }</TableCell>
              <TableCell className="hidden md:table-cell">{ user.active ? 'Active' : 'Inactive' }</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <UserIcon className="w-4 h-4 text-ce cursor-pointer" onClick={ () => editUser(user) }/>
                  <Dialog title="Are you sure to delete this user?" onAcceptHandler={ () => deleteUser(user.idUSerControl) }>
                    <TrashIcon className="w-4 h-4 text-ce cursor-pointer"/>
                  </Dialog>
                  <Dialog title="Are you sure to disable this user?" onAcceptHandler={ () => disableUser(user.idUSerControl) }>
                    <ActivityIcon className="w-4 h-4 text-ce cursor-pointer"/>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </div>
  )
}

export default TableField

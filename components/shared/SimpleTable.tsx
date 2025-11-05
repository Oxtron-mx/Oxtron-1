import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { SquarePen, SquareX } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Dialog } from './AlertDialog'

type Props<T> = {
  caption?: string
  data: T[]
  columns: Array<{
    header: string
    accessor: keyof T
  }>;
  options?: {
    onEdit: (row: T) => void
    onDelete: (row: T) => void
  }
};

const isDate = (value: any): boolean => {
  return (
    typeof value === 'string' &&
    (/^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)$/.test(value) ||
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/.test(value))
  );
}

export const SimpleTable = <T, >({ columns, data, caption, options }: Props<T>) => {
  return Array.isArray(data) ? (
    <div className="flex items-center justify-center w-full">
      <Table>
        { caption ?? (
          <TableCaption>{ caption }</TableCaption>
        ) }
        <TableHeader>
          <TableRow>
            { columns.map((column, columnIndex) => (
              <TableHead
                key={ window !== undefined ? window.crypto.randomUUID() : `column-${ columnIndex }` }
                className="text-left text-xs text-[#9FA2B4] font-bold overflow-hidden text-ellipsis whitespace-nowrap"
              >
                { column.header }
              </TableHead>
            )) }
            { options ? (
              <TableHead
                className="text-left text-xs text-[#9FA2B4] font-bold overflow-hidden text-ellipsis whitespace-nowrap">Options</TableHead>
            ) : null }
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll">
          { data.map((row, rowIndex) => (
            <TableRow key={ window !== undefined ? window.crypto.randomUUID() : `row-${ rowIndex }` }>
              { columns.map((column, cellIndex) => (
                <TableCell
                  className="text-base font-light text-[#9FA2B4] break-words whitespace-normal"
                  key={ window !== undefined ? window.crypto.randomUUID() : `cell-${cellIndex}` }>
                  { String(row[column.accessor]).length !== 0
                    ? isDate(row[column.accessor])
                      ? formatDateTime(String(row[column.accessor])).dateDay.split(' ')[1]
                      : String(row[column.accessor])
                    : '-' }
                </TableCell>
              )) }
              { options ? (
                <TableCell className="flex items-center justify-center text-lg font-light text-[#9FA2B4] gap-4">
                  <button onClick={ () => options.onEdit(row) } className="hover:text-blue-500">
                    <SquarePen className="w-4 h-4"/>
                  </button>
                  <Dialog title="Are you sure to delete this item?" onAcceptHandler={ () => options.onDelete(row) }>
                    <button className="hover:text-red-500">
                      <SquareX className="w-4 h-4"/>
                    </button>
                  </Dialog>
                </TableCell>
              ) : null }
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </div>
  ) : (
    <div className="flex items-center justify-center w-full">
      <p>{ data }</p>
    </div>
  )
}

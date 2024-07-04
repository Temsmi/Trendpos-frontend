
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import React from 'react'

type TableProps = {
  className?: string
  data: any[]
  columns: any[]
  columnTypes: string[] // Array of column types
  rowCount?: number

}

export const ReportTable = ({ className, data, columns, columnTypes, rowCount }: TableProps) => {
  const table = useReactTable({
    data,
    columns,
    rowCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  const isNumeric = (type: string) => {
    return type === 'numeric'
  }

  return (
    <table className={`w-full table-auto bg-white ${className}`}>
      <thead className='px-4 text-left'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id} style={{ whiteSpace: 'nowrap' }}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className='font-400 w-fit p-2 py-2 text-[14px] font-bold text-[#72748C]'>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className='border-b' style={{ whiteSpace: 'nowrap' }}>
            {row.getVisibleCells().map((cell, index) => (
              <td key={cell.id} className={`p-2 ${isNumeric(columnTypes[index]) ? 'text-right' : ''}`}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

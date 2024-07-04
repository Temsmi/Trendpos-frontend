'use client'

import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table'

type TableProps = {
  className?: string
  data: any[]
  columns: any[]
}

export const Table = ({ className, data, columns }: TableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })
  return (
    <table className='w-full table-auto bg-white'>
      <thead className='px-4 text-left'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className='font-400 w-fit py-2 text-[14px] font-bold text-[#72748C]'>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className='py-1'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

import React from 'react'
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import Button from '../button'
import { blue } from 'next/dist/lib/picocolors'

type UpdateTableProps = {
  className?: string
  data: any[]
  columns: any[]
  onUpdateClick: (userId: string) => void
  onDelete:()=>void
}

export const UpdateTable = ({ className, data, columns, onUpdateClick, onDelete }: UpdateTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const t = useTranslations('personnel-list')

  return (
    <table className={`w-full table-auto bg-white ${className}`}>
      <thead className='px-4 text-left'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className='font-400 w-fit py-2 text-[14px] font-bold text-[#72748C]'>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
            <th className='font-400 w-fit py-2 text-[14px] font-bold text-[#72748C]'>{t('actions')}</th>
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
            <td className='flex py-1 gap-1'>
              <Button onClick={() => onUpdateClick(row.original.userId)} className='h-8 w-8 text-white rounded-md ' variant='blueSolid' >{t('update')}</Button>

              <Button onClick={() => onDelete()} className='h-8 w-8 text-white rounded-md' variant='redSolid' size='small'>{t('delete') }</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


import React from 'react'

const SalesPagination = ({ currentPage, totalPages, onPageChange }: any) => {
  const startPage = Math.max(1, currentPage - 9)
  const endPage = Math.min(totalPages, startPage + 9)

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  return (
    <div className='mt-5 flex items-center justify-center'>
      <ul className='pagination flex space-x-2'>
        <li>
          <button
            className={'mr-2 rounded-lg p-3'}
            style={{ border: '1px solid #e6e5e3' }}
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}>
            {'<<'}
          </button>
          <button
            className={'rounded-lg p-3'}
            style={{ border: '1px solid #e6e5e3' }}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}>
            {'<'}
          </button>
        </li>
        {pages.map(page => (
          <li key={page}>
            <button
              className={`flex h-12 w-12 items-center justify-center rounded-lg p-3 ${
                currentPage === page ? 'bg-[#FF8F1E] text-white' : ''
              }`}
              style={{ border: '1px solid #e6e5e3' }}
              onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            className={'mr-2 rounded-lg p-3'}
            style={{ border: '1px solid #e6e5e3' }}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}>
            {'>'}
          </button>
          <button
            className={'rounded-lg p-3'}
            style={{ border: '1px solid #e6e5e3' }}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages - 9}>
            {'>>'}
          </button>
        </li>
      </ul>
    </div>
  )
}

export default SalesPagination

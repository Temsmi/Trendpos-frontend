import { useTranslations } from 'next-intl'

const TableHead = () => {
  const t = useTranslations('sales')
  return (
    <thead>
      <tr>
        <th scope='col' className='py-2.5 pl-6 pr-4 text-left text-sm font-normal'>
          {t('delete')}
        </th>
        <th scope='col' className='pr-4 text-left text-sm font-normal'>
          {t('barcode')}
        </th>
        <th scope='col' className='pr-4 text-left text-sm font-normal'>
          {t('product')}
        </th>
        <th scope='col' className='pr-4 text-left text-sm font-normal'>
          {t('quantity')}
        </th>
        <th scope='col' className='pr-4 text-left text-sm font-normal'>
          {t('unit_price')}
        </th>
        <th scope='col' className='pr-4 text-left text-sm font-normal'>
          {t('amount')}(₺)
        </th>
        {/* <th scope="col" className="pl-10 pr-3 text-left text-sm font-normal">
          G(?)
        </th> */}
      </tr>
    </thead>
  )
}

export default TableHead

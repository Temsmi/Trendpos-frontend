'use client'
import { Tab } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { Icon } from '@/components/icons'
import TableHead from '@/components/sales-table/head'
import SalesItem from '@/components/sales-table/item'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/lib/store'
import { addInitialStateFromLocalStorage, changeActiveCustomer, deleteCustomer } from '@/store/customersStore'
import Button from '@/components/button'
import { useTranslations } from 'next-intl'

type CustomerTabMenuProps = {
  className?: string
}

const CustomerTabMenu: React.FC<CustomerTabMenuProps> = ({ className }) => {
  const state = useSelector((state: RootState) => state.customers)
  const customers = state.customers
  const activeCustomerId = state.activeCustomerId
  const dispatch = useDispatch()
  const t = useTranslations('sales')

  useEffect(() => {
    const storageInitialState = typeof window !== 'undefined' ? localStorage?.getItem('customers') : null
    if (storageInitialState) {
      dispatch(addInitialStateFromLocalStorage(JSON.parse(storageInitialState)))
    }
  }, [])

  return (
    <div className={classNames('', className)}>
      <Tab.Group selectedIndex={activeCustomerId}>
        <Tab.List className='flex flex-nowrap overflow-y-auto'>
          {customers.map(customer => (
            <Tab as={Fragment} key={customer.id}>
              {({ selected }) => (
                <button
                  onClick={() => dispatch(changeActiveCustomer(customer.id))}
                  className={`grow px-4 py-6 outline-none ${
                    selected
                      ? 'border-spacing-[3px] border-b-[3px] border-[#0080FF] bg-[linear-gradient(170deg,_#E8E8E866_21.59%,#DDDDDD00_83.34%)]'
                      : 'bg-[#FAFAFA]'
                  } `}>
                  <div className='flex flex-col justify-items-start'>
                    <div className='flex items-start gap-2.5'>
                      {selected ? <Icon name='customerActive' /> : <Icon name='customer' />}
                      <div className='flex flex-col items-start text-[#1F2132]'>
                        <span className='whitespace-nowrap font-semibold'>
                          {t('customer')} {customer.id + 1}
                        </span>
                        <span className='truncate text-sm'>
                          (
                          {customer.totalAmount?.toFixed(2).toString().length < 7
                            ? customer.totalAmount?.toFixed(2)
                            : customer.totalAmount?.toFixed(2).toString().slice(0, 7) + '...'}
                          )
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='mt-3 max-h-72 w-full overflow-y-auto'>
          {customers.map((customer, index) => (
            <Tab.Panel key={index}>
              {customer?.cart && customer.cart.length > 0 ? (
                <table className='w-full'>
                  <TableHead />
                  <tbody>
                    {customer?.cart &&
                      customer.cart.map(product => <SalesItem key={product.barcode} product={product} />)}
                  </tbody>
                </table>
              ) : (
                <div> {t('add_product')}</div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default CustomerTabMenu

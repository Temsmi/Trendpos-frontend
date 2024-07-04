import { TbGraph, TbSettings, TbReportAnalytics } from 'react-icons/tb'
import { IconType } from 'react-icons'
import { RootState } from '@/lib/store'
import { useSelector } from 'react-redux'

type SalesData = {
  name: string
  options: {
    id: string
    name: string
    href?: string
    submenu?: {
      id: string
      name: string
      href: string
    }[]
  }[]
  icon: IconType
}[]

const GetHeaderData = (t: (arg0: string) => any) => {
  const {branchId} = useSelector((state: RootState) => state.currentAccount)  
  const sales_data: SalesData = [
    /* {
       name: 'Satış',
       options: [
         { id: 'S1', name: 'Satış Raporu', href: '/' },
         {
           id: 'S2',
           name: 'Tarihsel Satış Raporu',
           submenu: [
             { id: 'S3', name: 'Ürün Raporu', href: '/' },
             { id: 'S4', name: 'Stok Raporu', href: '/' },
           ],
         },
         { id: 'S5', name: 'Üretici Firma Boç Raporu', href: '/' },
       ],
       icon: TbGraph,
     },
     {
       name: 'Ürün',
       options: [
         { id: 'U1', name: 'Ürün Hakkında', href: '/' },
         { id: 'U2', name: 'Ürün Detay', href: '/' },
       ],
       icon: TbBox,
     },
     {
       name: 'Müşteri',
       options: [
         { id: 'M1', name: 'Satış Raporu', href: '/' },
         { id: 'M2', name: 'Tarihsel Satış Raporu', href: '/' },
         { id: 'M5', name: 'Tarihsel Satış Raporu', href: '/' },
         { id: 'M4', name: 'Tarihsel Satış Raporu', href: '/' },
       ],
       icon: TbUser,
     },
     {
       name: 'Raporlar',
       options: [
         { id: 'R1', name: 'Satış Raporu', href: '/' },
         { id: 'R2', name: 'Tarihsel Satış Raporu', href: '/' },
         { id: 'R3', name: 'Tarihsel Satış Raporu', href: '/' },
         { id: 'R4', name: 'Tarihsel Satış Raporu', href: '/' },
       ],
       icon: TbFileDescription,
     },
     */

    {
      name: t('control_panel'),
      options: [
        { id: 'S1', name: t('menu_home_page'), href: '/' },
        { id: 'S2', name: t('menu_sales'), href: '/sales' },
        { id: 'S5', name: t('menu_current_account'), href: '/current-account' }
      ],
      icon: TbGraph
    },
    {
      name:t('reports'),
      options:[
        {id:'R1',name:t('menu_sales_report'),href:`/sales-report/`},
        {id:'R2',name:t('menu_stock_reports'),href:`/stock-report/`},
      ],
      icon:TbReportAnalytics
    },
    {
      name: t('settings'),
      options: [
        { id: 'SE1', name: t('branch_profile'), href: '/branch-profile' },
        { id: 'SE2', name: t('list_of_employee'), href: '/personnel-list' }
        // { id: 'personelprofili', name: 'Personel Profili', href: '/' },
        // { id: 'kurbilgileri', name: 'Kur Bilgileri', href: '/' },
      ],
      icon: TbSettings
    }   
  ]

  return sales_data
}
export default GetHeaderData

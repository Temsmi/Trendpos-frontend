import Button from '../../button'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

const DashboardPageButton = async () => {
  const t = await getTranslations('dashboard')

  return (
    <div className='grid gap-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-5 '>
      <Link href='/sales'>
        <Button icon='sales' variant='skyBlue' color='white' title={t('sales_screen')} size='dashboardPage' />
      </Link>
      <Link href={'/sales-report/'}>
        <Button icon='reports' variant='orange' color='white' title={t('sales_report')} size='dashboardPage' />
      </Link>
      <Link href={'/stock-report/'}>
        <Button icon='stock' variant='red' color='white' title={t('stock_display')} size='dashboardPage' />
      </Link>
      <Link href='/current-account'>
        <Button icon='currentAccount' variant='mint' color='white' title={t('current')} size='dashboardPage' />
      </Link>
      <Link href='/'>
        <Button
          icon='regionalReports'
          variant='notActive'
          color='black'
          title={t('regional_reports')}
          size='dashboardPage'
        />
      </Link>
    </div>
  )
}

export default DashboardPageButton

import CurrencyLine from '@/components/currency'
import MynetNews from '@/components/dashboard/mynetnews'
import Notifications from '@/components/dashboard/notifications'
import mynetnewsService from '@/services/mynet-news-service'
import notificationService from '@/services/dashboard-notifications-service'
import Chart from '@/components/dashboard/chart'
import Chatbox from '@/components/chatbox'
import userInfoService from '@/services/user-info-service'
import DashboardNavbar from '@/components/dashboard-navbar'
import weatherService from '@/services/weather-service'
import chartService from '@/services/chart-service'
import Link from 'next/link'
import Image from 'next/image'
import DashboardPageButton from '@/components/button/dashboard-page'
import DashboardShortcutButton from '@/components/button/dashboard-shortcuts'
import { getTranslations } from 'next-intl/server'

export default async function Dashboard() {
  const mynetnews = await mynetnewsService()
  const trendboxNotifications = await notificationService({ notificationSource: 'trendbox' })
  const userInfo = await userInfoService()
  const chartData = await chartService()
  const weather = await weatherService({ longitude: '28.979530', latitude: '41.015137' })
  const t = await getTranslations('dashboard')

  return (
    <>
      {weather ? (
        <DashboardNavbar
          weather={weather.data ? weather.data.weatherCondition : ''}
          degrees={weather.data ? weather.data.temperature : NaN}
          userInfo={userInfo.data ? userInfo?.data : null}
        />
      ) : (
        <p>Hava Durumu Bilgisine Ulaşılamıyor</p>
      )}
      <CurrencyLine />
      <div className='my-5 flex h-full w-full flex-col gap-5 px-16 xl:flex-row'>
        <div className='flex w-full flex-col gap-5 xl:w-3/4 2xl:w-4/5'>
          <div className='flex h-96 w-full gap-5'>
            <div className='w-1/2'>
              {chartData ? (
                <Chart
                  title={chartData.data?.title}
                  description={chartData.data?.description}
                  totalSales={String(chartData.data?.totalAmount)}
                  chartData={chartData.data?.data}
                  weeks={chartData.data?.weeks}
                />
              ) : (
                <p>Grafik Bilgisine Ulaşılamıyor</p>
              )}
            </div>
            <div className='flex flex-1 flex-col justify-between md:gap-2 xl:w-2/5 xl:gap-1 2xl:flex-row 2xl:gap-5'>
              <div className='h-4/6 w-full 2xl:h-full 2xl:w-3/4'>
                {mynetnews ? <MynetNews items={mynetnews.data} /> : <p>Şuan Haberlere Ulaşılamıyor</p>}
              </div>
              <div>
                <DashboardShortcutButton />
              </div>
            </div>
          </div>
          <div>
            <DashboardPageButton />
          </div>
        </div>
        <div className='flex flex-1 flex-col justify-between  gap-5 xl:w-1/4 xl:flex-col 2xl:w-1/5'>
          <div className='relative h-[200px] w-full'>
            <Link
              href={'https://aktifventures.com/?utm_source=trendbox&utm_medium=banner&utm_campaign=pos'}
              target='_blank'>
              {/* <a target='_blank' rel='noopener noreferrer'> */}
              <Image
                src='/images/trendbox_banner.png'
                alt='placeholder'
                layout='fill'
                className='rounded-lg object-contain'
              />
            </Link>
          </div>
          {trendboxNotifications ? (
            <Notifications title={t('trendbox_notifications')} notifications={trendboxNotifications.data} />
          ) : (
            <p>Bildirimlere Ulaşılamıyor</p>
          )}
        </div>
      </div>
      {userInfo ? (
        <Chatbox
          name={userInfo.data ? userInfo.data.name : ''}
          surname={userInfo.data ? userInfo.data.surname : ''}
          email={userInfo.data ? userInfo.data.email : ''}
        />
      ) : (
        <p>Kullanıcı Bilgisine Ulaşılamıyor</p>
      )}
    </>
  )
}

import Button from '../../button'

const DashboardShortcutsButton = async () => {
  return (
    <div className="grid h-full sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-1 2xl:gap-5 gap-2">
      <Button icon="yemeksepetiLogo" variant="pink"   color="black" href="/" size="dashboardPage" className='!py-0 xl:!py-2 md:!py-2 sm:!py-2'/>
      <Button icon='nkolayLogo' variant='notActive' color='black' href='/' size='dashboardPage' className='!py-8' />
    </div>
  )
}

export default DashboardShortcutsButton

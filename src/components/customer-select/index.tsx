import Button from '@/components/button'
import CustomerSelectListBox from './listbox'

type CustomerSelectProps = {}

const CustomerSelect: React.FC<CustomerSelectProps> = ({}) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <div className='flex items-end  gap-1.5'>
        <CustomerSelectListBox />
        <Button variant='primarySolid' size='small'>
          Seç
        </Button>
        <Button variant='redSolid' size='small'>
          İptal
        </Button>
        <Button variant='blueSolid' size='small' className='!px-3.5'>
          Satışlar
        </Button>
      </div>
      <div className='flex w-full items-center justify-between gap-x-6 whitespace-nowrap text-xs font-semibold'>
        <div className='flex items-center gap-x-6'>
          <span>Limit: 0.00</span>
          <span>Kalan: 0.00</span>
        </div>
        <span>Diğer Sayfalar</span>
      </div>
    </div>
  )
}

export default CustomerSelect

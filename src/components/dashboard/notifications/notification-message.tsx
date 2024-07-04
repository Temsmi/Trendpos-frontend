import { Icon } from '@/components/icons'

type NotificationMessageProps = {
  title: string
  content: string
  notificationType: string
}

const iconMap: any = {
  info: 'bell',
  warning: 'urgent'
}

const NotificationMessage: React.FC<NotificationMessageProps> = ({ title, content, notificationType }) => {
  return (
    <li className='flex items-start gap-2 p-2'>
      <i className='rounded-full bg-[#FFF7F0]'>
        {iconMap[notificationType] && (
          <Icon name={iconMap[notificationType]} color='#FF6D00' primaryColor='#C19875' secondaryColor='#FF6D00' />
        )}
      </i>
      <div>
        <h3 className='font-semibold'>{title}</h3>
        <p className='text-sm text-gray-700'>{content}</p>
      </div>
    </li>
  )
}

export default NotificationMessage

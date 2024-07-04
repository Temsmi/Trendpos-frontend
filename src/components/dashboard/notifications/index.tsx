import { NotificationType } from '@/lib/types'
import NotificationMessage from './notification-message'

type NotificationsProps = {
  title: string
  notifications: NotificationType[]
}

const Notifications: React.FC<NotificationsProps> = ({ title, notifications }) => {
  return (
    <div className='h-[326px] w-full overflow-hidden rounded-xl bg-white shadow-[0px_4px_10px_5px_rgba(169,169,169,0.22)]'>
      <h1 className='p-4 font-bold text-[#FF6D00]'>{title}</h1>
      <hr />
      <ul className='max-h-52 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#FF6D00]'>
        {' '}
        {notifications?.map((notification, index) => {
          return (
            <NotificationMessage
              key={index}
              title={notification.title}
              content={notification.content}
              notificationType={notification.notificationType}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default Notifications

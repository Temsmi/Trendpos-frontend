import classNames from 'classnames'
import { Icon as IconComponent } from '@/components/icons'

type IconProps = {
  name: string
}

const Icon: React.FC<IconProps> = ({ name }) => {
  return <IconComponent name={name} />
}

type TitleProps = {
  children: React.ReactNode
}

const Title: React.FC<TitleProps> = ({ children }) => {
  return <h2 className='mt-5 text-center text-2xl font-bold text-black'>{children}</h2>
}

type ContentProps = {
  size?: 'default' | 'small'
  children: React.ReactNode
}

const Content: React.FC<ContentProps> = ({ children, size = 'default' }) => {
  return (
    <p
      className={classNames(
        'h-14 text-center text-sm font-normal leading-[18px] text-black',
        size === 'default' ? 'max-w-[405px] ' : 'max-w-[205px]'
      )}>
      {children}
    </p>
  )
}

const Root = ({ children }: { children: React.ReactNode }) => {
  return <div className='flex flex-col items-center justify-center gap-6'>{children}</div>
}

export { Root, Title, Content, Icon }

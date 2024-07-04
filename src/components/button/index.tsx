'use client'
import classNames from 'classnames'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '../icons'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  onClick?: () => void
  children?: React.ReactNode
  className?: string
  size?: 'default' | 'square' | 'small' | 'dashboardPage'
  variant?:
    | 'pink'
    | 'primaryGradient'
    | 'primarySolid'
    | 'redSolid'
    | 'blueSolid'
    | 'greenSolid'
    | 'outline'
    | 'outlineOrange'
    | 'outlineBlue'
    | 'outlineOpacity'
    | 'custom'
    | 'whiteSolid'
    | 'skyBlue'
    | 'orange'
    | 'red'
    | 'mint'
    | 'white'
    | 'purple'
    | 'softBlue'
    | 'notActive'
  href?: string
  icon?: string
  title?: string
  ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement>
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  size = 'default',
  variant = 'primaryGradient',
  href,
  icon,
  title,
  ref,
  ...props
}) => {
  const primaryClass = classNames('flex justify-center items-center cursor-pointer rounded-xl text-sm font-medium', {
    'flex-col': icon && !children,

    'px-8 py-4': size === 'default',
    'aspect-square p-2': size === 'square',
    'px-6 py-4': size === 'small',
    'w-full h-full items-center p-4 text-white text-lg gap-2': size === 'dashboardPage',

    'bg-gradient-to-b from-orange-500 to-amber-500 text-white': variant === 'primaryGradient',
    'bg-[#FF8F1E]  text-white': variant === 'primarySolid',
    'bg-[#FF3F3F]  text-white': variant === 'redSolid',
    'bg-[#0080FF]  text-white': variant === 'blueSolid',
    'bg-[#46C772]  text-white': variant === 'greenSolid',
    'bg-white text-[#72748C ] border border-neutral-200': variant === 'outline',
    'bg-white text-black border border-black border-opacity-10': variant === 'outlineOpacity',
    'bg-white text-[#0080FF] border border-sky-500': variant === 'outlineBlue',
    'bg-white text-[#FF6D00] border border-orange-500': variant === 'outlineOrange',
    'flex items-center w-full h-12 min-w-18 rounded-xl border border-neutral-200 text-slate-500 text-sm font-medium p-4 gap-1.5':
      variant === 'whiteSolid',
    'text-slate-500 p-4 gap-1.5': variant === 'whiteSolid',
    'bg-[#F5014D]': variant === 'pink',
    'bg-[#FF8F1E]': variant === 'orange',
    'bg-[#47ABFF]': variant === 'skyBlue',
    'bg-[#FC5F5F]': variant === 'red',
    'bg-[#63CC9F]': variant === 'mint',
    'bg-[#B496E0]': variant === 'purple',
    'bg-[#77C0E0]': variant === 'softBlue',
    'bg-white': variant === 'white',
    'bg-[#F2F2F2] text-black text-lg transition-opacity duration-150': variant === 'notActive'
  })

  const iconMap: any = {
    sales: <Icon name='sales' color='white' />,
    reports: <Icon name='reports' color='white' />,
    stock: <Icon name='stock' color='white' />,
    currentAccount: <Icon name='currentAccount' color='white' />,
    regionalReports: <Icon name='regionalReports' color='black' />,
    yemeksepetiLogo: '/images/yemek_sepeti_mahalle.png',
    nkolayLogo: '/images/n-kolay-logo.png'
  }

  const renderIcon = () => {
    if (!icon || !iconMap[icon]) return null
    if (icon === 'yemeksepetiLogo') {
      return <Image src={iconMap[icon]} width={120} height={60} alt='icon' className='items-center' />
    } else {
      return typeof iconMap[icon] === 'string' ? (
        <Image src={iconMap[icon]} width={120} height={60} alt='icon' className='items-center px-2 ' />
      ) : (
        iconMap[icon]
      )
    }
  }

  const t = useTranslations('dashboard')

  const notActiveMessage =
    variant === 'notActive' || variant === 'pink' ? (
      <span className='absolute z-10 rounded bg-gray-800 px-2 py-1 text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100'>
        {t('service_unavailable')}
      </span>
    ) : null

  return href ? (
    <Link
      href={href}
      className={cn(primaryClass, className, variant === 'notActive' || variant === 'pink' ? 'group' : '')}
      {...props}>
      {renderIcon()}
      {title}
      {children}
      {notActiveMessage}
    </Link>
  ) : (
    <button
      className={cn(primaryClass, className, variant === 'notActive' ? 'group' : '')}
      onClick={onClick}
      {...props}>
      {renderIcon()}
      {title}
      {children}
      {notActiveMessage}
    </button>
  )
}

export default Button

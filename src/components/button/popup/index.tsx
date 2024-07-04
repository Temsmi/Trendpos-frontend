'use client'
import classNames from 'classnames'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void)
  children?: React.ReactNode
  className?: string
  color?: 'primary' | 'secondaryGrey' | 'white'
  textColor?: 'textWhite' | 'textBlack' | 'textBlue'
  href?: string
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  color = 'primary',
  textColor = 'textWhite',
  href,
  ...props
}) => {
  const primaryClass = classNames(' flex justify-center items-center space-x-2 rounded-xl w-[162px] h-12', {
    'bg-gradient-to-b from-orange-500 to-amber-500 ': color === 'primary',
    'bg-[#D9D9D9]': color === 'secondaryGrey',
    'bg-white border border-zinc-200': color === 'white',
    'text-white': textColor === 'textWhite',
    'text-black underline': textColor === 'textBlack',
    'text-blue-950': textColor === 'textBlue'
  })

  return (
    <button className={classNames(primaryClass, className)} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button

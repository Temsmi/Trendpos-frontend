import { cn } from '@/lib/utils'

type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const Separator: React.FC<SeparatorProps> = ({ orientation, className }) => {
  return (
    <hr
      className={cn('shrink-0 bg-[#F1F1F1]', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
    />
  )
}
export default Separator

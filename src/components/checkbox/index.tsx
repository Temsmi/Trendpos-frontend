import classNames from 'classnames'
import { ReactNode, forwardRef } from 'react'

type CheckboxProps = {
  className?: string
  name: string
  label: string | any
  ref?: React.ForwardedRef<HTMLInputElement>
  srOnly?: boolean
}
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ name, label, className, srOnly = true, ...props }, ref) => {
    return (
      <div className='flex gap-x-2 w-full'>
        <input
          name={name}
          id={name}
          type='checkbox'
          title={String(label)}
          aria-label={label}
          ref={ref}
          {...props}
          className="relative h-5 w-5 cursor-pointer appearance-none rounded border border-[#9FA1B3] outline-none after:absolute after:left-1/2 after:top-0  after:hidden after:h-3  after:w-2 after:-translate-x-1/2 after:rotate-45 after:border-2 after:border-[#5c5e68] after:border-l-transparent after:border-t-transparent after:content-['']  checked:after:block"
        />
        <label className={classNames('w-fit -mt-1')}>{label}</label>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
export default Checkbox

'use client' // Not a standard JavaScript or TypeScript syntax, might cause an ESLint issue
import classNames from 'classnames'
import { useState, useRef, useEffect, ChangeEvent, forwardRef } from 'react'
import { UseFormSetValue } from 'react-hook-form'

type PinInputProps = {
  length: number
  className?: string
  timeEnd: boolean
  setValue: UseFormSetValue<any>
}

const PinInput: React.FC<PinInputProps> = forwardRef<HTMLInputElement, PinInputProps>(
  ({ length = 4, className, timeEnd, setValue }, ref) => {
    const [values, setValues] = useState<string[]>(Array(length).fill(''))
    const inputs = useRef<HTMLInputElement[]>([])

    const focusNext = (pos: number, backward = false) => {
      if (backward) {
        if (pos > 0) {
          inputs.current[pos - 1].focus()
        }
      } else {
        if (pos < values.length - 1) {
          inputs.current[pos + 1].focus()
        } else if (pos === values.length - 1) {
          inputs.current[pos].blur()
        }
      }
    }

    const handleChange = async (e: ChangeEvent<HTMLInputElement>, pos: number) => {
      const vals = [...values]
      vals[pos] = e.target.value
      setValues(vals)
      setValue('otpCode', vals.join(''))

      if (e.target.value !== '') {
        focusNext(pos)
      } else if (e.target.value === '') {
        focusNext(pos, true)
      }
    }

    useEffect(() => {
      inputs.current[0].focus()
    }, []) // Dependency array is empty because this effect runs once

    return (
      <>
        <div className='flex gap-4'>
          {values.map((value, i) => (
            <input
              key={i}
              ref={(inputRef: HTMLInputElement) => {
                inputs.current[i] = inputRef
              }}
              value={value}
              type='password'
              disabled={timeEnd}
              required
              onChange={e => handleChange(e, i)}
              maxLength={1}
              className={classNames(
                `h-12 w-12 shrink-0 rounded-md pb-2 text-center text-6xl outline-0 ring-1`,
                {
                  'text-red-500 ring-red-500': timeEnd,
                  'ring-gray-300': !timeEnd
                },
                className
              )}
            />
          ))}
          <input ref={ref} name='otpCode' type='hidden' value={values} />
        </div>
      </>
    )
  }
)

PinInput.displayName = 'PinInput'

export default PinInput

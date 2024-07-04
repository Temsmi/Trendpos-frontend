import classNames from 'classnames'
import { useWizard } from 'react-use-wizard'
import { Fragment } from 'react'
import { useTranslations } from 'next-intl'

const RegisterStepsHeader = () => {
  const { activeStep, goToStep } = useWizard()

  const t = useTranslations('auth')

  const steps = [
    {
      label: t('pre_info'),
      step: 1
    },
    {
      label: t('verification'),
      step: 2
    },
    {
      label: t('complete'),
      step: 3
    }
  ]

  return (
    <div className='flex h-fit shrink-0 items-center justify-between'>
      {steps.map(step => (
        <Fragment key={step.step}>
          <div className={classNames('z-[1] shrink-0', activeStep > step.step && 'cursor-pointer')}>
            <div
              className={classNames(
                'mx-auto flex h-9 w-9 items-center justify-center rounded-full duration-500 ease-linear md:h-10 md:w-10',
                activeStep + 1 >= step.step ? 'bg-[#0080FF]' : 'bg-white ring-2 ring-[#BDBDBD]'
              )}>
              <div
                className={classNames('text-lg font-semibold', {
                  'text-white': activeStep + 1 >= step.step,
                  'text-[#BDBDBD]': activeStep + 1 < step.step
                })}>
                {step.step}
              </div>
            </div>
            <div className='whitespace-nowrap'>
              <p className='mt-2'>{step.label}</p>
            </div>
          </div>
          {step.step !== steps.length && <div className='-mt-8 h-[3px] w-full bg-[#F2F2F2]'></div>}
        </Fragment>
      ))}
    </div>
  )
}

export default RegisterStepsHeader

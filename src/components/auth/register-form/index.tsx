'use client'
import { Wizard } from 'react-use-wizard'
import RegisterFirstStep from './first-step'
import RegisterStepsHeader from './register-steps-header'
import RegisterSecondStep from './second-step'
import ThirdStep from './third-step'
import { useForm } from 'react-hook-form'
import { RegisterDataType } from '@/lib/types'

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors }
  } = useForm<RegisterDataType>()

  return (
    <Wizard header={<RegisterStepsHeader />}>
      <RegisterFirstStep errors={errors} register={register} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <RegisterSecondStep
        register={register}
        handleSubmit={handleSubmit}
        setValue={setValue}
        isSubmitting={isSubmitting}
      />
      <ThirdStep />
    </Wizard>
  )
}
export default RegisterForm

import ForgotPasswordForm from '@/components/auth/forgot-password-form'
import * as InformationBox from '@/components/auth/information-box'
import { useTranslations } from 'next-intl'

const ForgotPasswordPage = () => {
  const t = useTranslations('auth')

  return (
    <>
      <InformationBox.Root>
        <InformationBox.Icon name='key' />
        <InformationBox.Title>{t('new_password_title')}</InformationBox.Title>
        <InformationBox.Content size='small'>{t('new_password_desc')}</InformationBox.Content>
      </InformationBox.Root>
      <ForgotPasswordForm />
    </>
  )
}

export default ForgotPasswordPage

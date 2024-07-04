import ResetPasswordForm from '@/components/auth/reset-password-form'
import * as InformationBox from '@/components/auth/information-box'

const PasswordResetPage = () => {
  return (
    <>
      <InformationBox.Root>
        <InformationBox.Icon name='key' />
        <InformationBox.Title>Yeni Şifre Oluştur</InformationBox.Title>
        <InformationBox.Content size='small'>
          Yeni bir şifre belirleyip tekrar giriş yapabilirsiniz.
        </InformationBox.Content>
      </InformationBox.Root>
      <ResetPasswordForm />
    </>
  )
}

export default PasswordResetPage

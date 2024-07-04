import Image from 'next/image'

type AuthLayoutProps = {
  children: React.ReactNode
}

const AuthLayoutWrapper = ({ children }: AuthLayoutProps) => {
  return (
    <main className='relative flex h-full items-center justify-center overflow-hidden'>
      <Image
        src='/images/login-circle.svg'
        alt='login-circle'
        width={226}
        height={537}
        className='absolute left-0 top-[40%] -z-20'
      />
      <div className='min-h-[calc(100vh-96px)] w-full max-w-lg px-4 pb-8 pt-16 md:pt-32 lg:-ml-[30%]'>{children}</div>
      <div className='clipPath absolute right-0 top-0 -z-10 h-full'>
        <Image
          src='/images/login-man.png'
          alt='login-circle'
          width={1013}
          height={1080}
          className='h-full object-cover object-center'
        />
      </div>
    </main>
  )
}

export default AuthLayoutWrapper

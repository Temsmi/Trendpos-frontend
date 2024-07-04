export default function Loading() {
  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div className='h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-orange-500' />
    </div>
  )
}

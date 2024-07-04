'use client'
import { MynetNewsType } from '@/lib/types'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type MynetNewsProps = {
  items: MynetNewsType[]
}

const MynetNews: React.FC<MynetNewsProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleClick = (index: number) => {
    setCurrentIndex(index)
  }
  const handleLinkClick = () => {
    window.open(items[currentIndex].linkUrl)
  }

  const nextIndex = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % items.length)
  }

  useEffect(() => {
    // Set up a timer to scroll automatically every 5 seconds (adjust interval as needed)
    const interval = setInterval(nextIndex, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='relative h-full w-full overflow-hidden rounded-lg'>
      <div
        className={`duration-10 flex h-full transition ease-out`}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}>
        {items.map((item, index) => (
          <Image
            height={640}
            width={640}
            key={index}
            src={item.imageUrl}
            alt={item.title}
            className='h-full w-full shrink-0 object-cover'
            onError={(e) => e.currentTarget.src = '/images/default_mynet.png'}
          />
        ))}
      </div>

      <div className='absolute right-5 top-5'>
        <Image fill src='images/mynet.svg' alt='mynet logo' />
      </div>

      <div className='absolute bottom-10 left-5 right-0'>
        <h1
          className='cursor-pointer bg-[#FF6D00] bg-opacity-90 p-2 text-lg font-semibold text-[#FFFFFF]'
          onClick={handleLinkClick}>
          {items[currentIndex]?.title}
        </h1>
      </div>

      <div className='absolute bottom-4 right-4 flex'>
        {items.map((item, index) => (
          <div
            key={index}
            className={`mx-1 h-4 w-4 cursor-pointer rounded-full border ${
              currentIndex === index ? 'bg-[#D9D9D9]' : 'bg-transparent'
            }`}
            onClick={() => handleClick(index)}></div>
        ))}
      </div>
    </div>
  )
}

export default MynetNews

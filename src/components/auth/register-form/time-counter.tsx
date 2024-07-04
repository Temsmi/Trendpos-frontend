'use client'
import { Icon } from '@/components/icons'
import { useState, useEffect } from 'react'

type TimeCounterProps = {
  date: string | number
  onTimeEnd: (timeEnded: boolean) => void
}

const TimeCounter: React.FC<TimeCounterProps> = ({ date, onTimeEnd }) => {
  const calculateTimeLeft = () => Math.floor((new Date(date).getTime() - Date.now()) / 1000)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

  useEffect(() => {
    const timerId = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1)

        if (timeLeft === 1) {
          clearInterval(timerId)
          onTimeEnd(true)
        }
      }
    }, 1000)

    return () => clearInterval(timerId)
  }, [onTimeEnd, timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className='flex items-center gap-1'>
      <Icon name='timer' color='#C2C2C2' />
      <p className='text-lg font-semibold text-[#878787]'>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  )
}

export default TimeCounter

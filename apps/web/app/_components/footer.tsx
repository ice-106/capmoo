'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  CalendarDays,
  Bot,
  MessageSquareText,
  UserRound,
} from 'lucide-react'

const Footer = () => {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-10 flex h-28 items-start justify-center bg-white p-4 shadow-[0_-2px_8px_-2px_rgba(0,0,0,0.2)]'>
      <div className='flex space-x-7'>
        <div
          className={`rounded-md p-2 ${isActive('/discover') ? 'text-pumpkin' : 'text-darkgrey'}`}
          onClick={() => router.push('/discover')}
        >
          <Home size={24} />
        </div>
        <div
          className={`rounded-md p-2 ${isActive('/schedule') ? 'text-pumpkin' : 'text-darkgrey'}`}
          onClick={() => router.push('/schedule')}
        >
          <CalendarDays size={24} />
        </div>
        <div
          className={`rounded-md p-2 ${isActive('/chat') ? 'text-pumpkin' : 'text-darkgrey'}`}
          onClick={() => router.push('/chat')}
        >
          <Bot size={24} />
        </div>
        <div
          className={`rounded-md p-2 ${isActive('/reviews') ? 'text-pumpkin' : 'text-darkgrey'}`}
          onClick={() => router.push('/reviews')}
        >
          <MessageSquareText size={24} />
        </div>
        <div
          className={`rounded-md p-2 ${isActive('/profile') ? 'text-pumpkin' : 'text-darkgrey'}`}
          onClick={() => router.push('/profile')}
        >
          <UserRound size={24} />
        </div>
      </div>
    </nav>
  )
}

export default Footer

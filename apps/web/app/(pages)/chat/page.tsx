'use client'

import Header from '../../_components/header'
import Footer from '../../_components/footer'
import TextBubble from './_components/textBubble'
import TextInput from './_components/textInput'
import { useState, useRef, useEffect } from 'react'

const WEBHOOK_URL = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL

type Message = {
  text: string
  sender: 'ai' | 'user'
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hi there! How can I help you today?', sender: 'ai' },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  async function handleSendMessage(message: string): Promise<void> {
    if (!message.trim()) return

    // Add user message to chat
    setMessages((prev) => [...prev, { text: message, sender: 'user' }])
    setIsLoading(true)

    if (!WEBHOOK_URL) {
      throw new Error('Webhook URL is not defined')
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // Process the response
      const responseText = await response.text()
      let aiResponse = responseText

      // Try to extract response from JSON if applicable
      try {
        const data = JSON.parse(responseText)
        aiResponse = data.response || data.message || responseText
      } catch {
        // Keep the text response as is if not JSON
      }

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          text: aiResponse,
          sender: 'ai',
        },
      ])
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't process your message right now.",
          sender: 'ai',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='font-poppins flex w-full flex-col'>
      <Header text='Capmoo AI' />

      <div
        ref={containerRef}
        className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-24 pt-4'
      >
        {messages.map((msg, index) => (
          <TextBubble
            key={index}
            variant={msg.sender}
            showNameTag={
              index === 0 || messages[index - 1]?.sender !== msg.sender
            }
          >
            {msg.text}
          </TextBubble>
        ))}

        {isLoading && (
          <div className='ml-4 mt-2 flex items-center'>
            <div className='rounded-lg bg-gray-200 p-2'>
              <div className='flex space-x-1'>
                <div
                  className='h-2 w-2 animate-bounce rounded-full bg-gray-500'
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className='h-2 w-2 animate-bounce rounded-full bg-gray-500'
                  style={{ animationDelay: '200ms' }}
                ></div>
                <div
                  className='h-2 w-2 animate-bounce rounded-full bg-gray-500'
                  style={{ animationDelay: '400ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className='h-1' />
      </div>

      <div className='fixed bottom-28 left-1/2 w-[343px] -translate-x-1/2 transform bg-white p-4'>
        <TextInput
          onSend={handleSendMessage}
          placeholder='Ask Capmoo something...'
          disabled={isLoading}
        />
      </div>

      <Footer />
    </main>
  )
}

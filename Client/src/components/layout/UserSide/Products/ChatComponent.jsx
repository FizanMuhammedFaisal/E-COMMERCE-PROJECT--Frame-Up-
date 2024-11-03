'use client'

import { useState, useRef, useEffect } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform
} from 'framer-motion'
import { Send, User, Bot, X, ChevronDown, Info } from 'lucide-react'
import apiClient from '../../../../services/api/apiClient'
import { SiGooglegemini } from 'react-icons/si'

const suggestions = [
  "Tell me about the artist's technique",
  "What's the historical context of this painting?"
  //   'Describe the color palette used',
  //   'What emotions does this painting evoke?'
]

export default function PaintingChatbot({ toggleChat }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const dragY = useMotionValue(0)
  const dragOpacity = useTransform(dragY, [0, 200], [1, 0])

  const handleSend = async e => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const res = await apiClient.post('/api/chat/query', { query: input })
      console.log(res.data)
      const botMessage = { text: res.data.response, isUser: false }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error fetching response:', error)
      const errorMessage = {
        text: ` I'm sorry, I couldn't process your request. Please try again later.`,
        isUser: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  //to only diable scroll on mobile devices
  useEffect(() => {
    const handleTouchStart = () => {
      if (window.innerWidth < 640) document.body.style.overflow = 'hidden'
    }
    const handleTouchEnd = () => {
      if (window.innerWidth < 640) document.body.style.overflow = 'auto'
    }

    chatContainerRef.current.addEventListener('touchstart', handleTouchStart)
    chatContainerRef.current.addEventListener('touchend', handleTouchEnd)

    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener(
          'touchstart',
          handleTouchStart
        )
        chatContainerRef.current.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [])

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 100) {
      toggleChat()
    }
  }

  const chatContent = (
    <>
      <motion.div
        className=' pt-5 bg-gradient-to-r from-customColorTertiaryLight via-customColorTertiary to-customColorTertiaryDark p-4 flex justify-between items-center'
        style={{ opacity: dragOpacity }}
      >
        <h2 className='font-bold text-lg text-white '>Painting Expert Chat</h2>
        <button
          onClick={toggleChat}
          className='text-white hover:text-gray-200 transition-colors'
          aria-label='Close chat'
        >
          <X className='h-6 w-6' />
        </button>
      </motion.div>

      <motion.div
        ref={chatContainerRef}
        className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'
        style={{ opacity: dragOpacity }}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-end space-x-2 ${
                  message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-full ${
                    message.isUser
                      ? 'bg-customColorTertiary'
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                  }`}
                >
                  {message.isUser ? (
                    <User className='h-5 w-5 text-white' />
                  ) : (
                    <Bot className='h-5 w-5 text-white' />
                  )}
                </div>
                <div
                  className={`px-3 py-2 rounded-md ${
                    message.isUser
                      ? 'bg-gradient-to-b from-customColorTertiaryLight via-customColorTertiary to-customColorTertiaryDark text-white'
                      : 'bg-slate-200 text-gray-800'
                  } max-w-[80%] shadow-md`}
                >
                  {message.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='flex items-center space-x-2'
          >
            <div className='px-3 py-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'>
              <Bot className='h-6 w-6 text-white' />
            </div>
            <div className='px-3 py-1 rounded-md bg-white text-gray-800 shadow-md'>
              <span className='inline-flex space-x-1'>
                <SiGooglegemini
                  size={14}
                  className='rounded-full animate-bounce'
                  style={{ animationDelay: '0ms', color: 'blue' }}
                />
                <SiGooglegemini
                  size={14}
                  className='  rounded-full animate-bounce'
                  style={{ animationDelay: '150ms', color: 'purple' }}
                />
                <SiGooglegemini
                  size={14}
                  className='  rounded-full animate-bounce'
                  style={{ animationDelay: '300ms', color: 'pink' }}
                />
              </span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </motion.div>

      <motion.div
        className='bg-gray-100 p-2 border-t border-gray-200'
        style={{ opacity: dragOpacity }}
      >
        <div className='flex items-center space-x-2 mb-2'>
          <Info className='h-4 w-4 text-customColorTertiaryDark' />
          <p className='text-sm text-gray-600'>Try asking:</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInput(suggestion)}
              className='text-xs bg-white text-customColorTertiaryDark px-2 py-1 rounded-full border border-customColorTertiarypop hover:bg-blue-50 transition-colors'
            >
              {suggestion}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.form
        onSubmit={handleSend}
        className='p-4 bg-white border-t border-gray-200'
        style={{ opacity: dragOpacity }}
      >
        <div className='flex space-x-2'>
          <input
            type='text'
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Ask about this painting...'
            className='flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop transition-shadow'
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-customColorTertiary text-white p-2 px-4 rounded-lg shadow-md hover:bg-customColorTertiaryLight transition-colors'
            type='submit'
          >
            <Send size={20} />
          </motion.button>
        </div>
      </motion.form>
    </>
  )

  return (
    <>
      {/* Mobile version */}
      <AnimatePresence>
        <motion.div
          className='fixed inset-x-0 bottom-0 z-50 w-full sm:hidden'
          initial={{ y: '50%' }}
          animate={{ y: 0, transition: { duration: 0.5 } }}
          exit={{ y: '100%' }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 200,
            duration: 0.6
          }}
          drag='y'
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          style={{
            y: dragY,
            willChange: 'transform'
          }}
        >
          <div className='bg-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col h-[70vh]'>
            <div className='absolute top-0 left-0 right-0 h-1 flex justify-center'>
              <div className='w-16 h-1 bg-gray-300 rounded-full mt-1' />
            </div>

            {chatContent}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Desktop version */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className='hidden sm:flex w-96 bg-white rounded-lg shadow-2xl overflow-hidden flex-col h-[600px]  right-4 z-50'
      >
        {chatContent}
      </motion.div>
    </>
  )
}

import { useState, useRef, useEffect } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform
} from 'framer-motion'
import { Send, User, Bot, X, Info } from 'lucide-react'
import apiClient from '../../../../services/api/apiClient'
import { SiGooglegemini } from 'react-icons/si'
import EmptyMessagesBot from '../../../common/Animations/EmptyMessagesBot'

const suggestions = [
  "Tell me about the artist's technique",
  "What's the historical context of this painting?"
]

export default function PaintingChatbot({ toggleChat, id }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const dragY = useMotionValue(0)
  const dragOpacity = useTransform(dragY, [0, 800], [1, 0])

  const handleSend = async e => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const res = await apiClient.post('/api/chat/query', {
        query: input,
        productId: id
      })
      console.log(res.data)
      const botMessage = { text: res.data.response, isUser: false }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error fetching response:', error)
      const errorReply =
        error?.response?.data?.error ||
        ` I'm sorry, I couldn't process your request. Please try again later.`
      const errorMessage = {
        text: errorReply,
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

  useEffect(() => {
    const handleTouchStart = () => {
      if (window.innerWidth < 640) document.body.style.overflow = 'hidden'
    }
    const handleTouchEnd = () => {
      if (window.innerWidth < 640) document.body.style.overflow = 'auto'
    }

    chatContainerRef.current?.addEventListener('touchstart', handleTouchStart)
    chatContainerRef.current?.addEventListener('touchend', handleTouchEnd)

    return () => {
      chatContainerRef.current?.removeEventListener(
        'touchstart',
        handleTouchStart
      )
      chatContainerRef.current?.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 100) {
      navigator.vibrate(100)
      toggleChat()
    }
  }

  const handleSuggestionClick = suggestion => {
    setInput(suggestion)
    setTimeout(() => {
      handleSend({ preventDefault: () => {} })
    }, 300)
  }

  const chatContent = (
    <div className='w-full h-full flex flex-col bg-white rounded-t-2xl sm:rounded-lg shadow-2xl overflow-hidden'>
      <div className='bg-gradient-to-r from-customColorTertiaryLight via-customColorTertiary to-customColorTertiaryDark p-4 flex justify-between items-center'>
        <h2 className='text-lg font-bold text-white'>Painting Expert Chat</h2>
        <button
          onClick={toggleChat}
          className='text-white hover:text-gray-200 transition-colors focus:outline-none'
          aria-label='Close chat'
        >
          <X className='h-6 w-6' />
        </button>
      </div>
      <div className='flex-1 flex flex-col overflow-hidden'>
        <div className='flex-1 p-3 overflow-y-auto' ref={chatContainerRef}>
          <AnimatePresence>
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`flex items-end space-x-2 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-customColorTertiary' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'}`}
                    >
                      {message.isUser ? (
                        <User className='h-5 w-5 text-white' />
                      ) : (
                        <Bot className='h-5 w-5 text-white' />
                      )}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg ${
                        message.isUser
                          ? 'bg-gradient-to-b from-customColorTertiaryLight via-customColorTertiary to-customColorTertiaryDark text-white'
                          : 'bg-gray-100 text-gray-800'
                      } max-w-[80%] shadow-md`}
                    >
                      {message.text}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyMessagesBot />
            )}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='flex items-center space-x-2 mb-4'
            >
              <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'>
                <Bot className='h-5 w-5 text-white' />
              </div>
              <div className='px-3 py-2 rounded-lg bg-gray-100 text-gray-800 shadow-md'>
                <span className='inline-flex space-x-1'>
                  <SiGooglegemini
                    size={14}
                    className='rounded-full animate-bounce'
                    style={{ animationDelay: '0ms', color: 'blue' }}
                  />
                  <SiGooglegemini
                    size={14}
                    className='rounded-full animate-bounce'
                    style={{ animationDelay: '150ms', color: 'purple' }}
                  />
                  <SiGooglegemini
                    size={14}
                    className='rounded-full animate-bounce'
                    style={{ animationDelay: '300ms', color: 'pink' }}
                  />
                </span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className='bg-gray-50 p-4 border-t border-gray-200'>
          <div className='flex items-center space-x-2 mb-2'>
            <Info className='h-4 w-4 text-customColorTertiaryDark' />
            <p className='text-sm text-gray-600'>Try asking:</p>
          </div>
          <div className='flex flex-wrap gap-2 mb-4'>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className='text-xs bg-white text-customColorTertiaryDark px-2 py-1 rounded-full border border-customColorTertiary hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-customColorTertiary'
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form onSubmit={handleSend} className='flex space-x-2'>
            <input
              type='text'
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Ask about this painting...'
              className='w-full p-2 border-2   border-customColorTertiaryLight  rounded-md text-gray-900  focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop focus:border-customColorSecondary transition ease-in-out duration-300  placeholder-opacity-75'
            />
            <button
              type='submit'
              className='bg-customColorTertiary hover:bg-customColorTertiaryLight text-white px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-customColorTertiary'
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      <motion.div
        className=' fixed sm:relative inset-x-0 bottom-0 z-50 w-full sm:w-96  sm:left-auto sm:bottom-4'
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 150,
          mass: 0.5
        }}
        drag='y'
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        style={{
          y: dragY,
          opacity: dragOpacity,
          willChange: 'transform, opacity'
        }}
      >
        <div className='h-[70vh] sm:h-[600px]'>{chatContent}</div>
      </motion.div>
    </AnimatePresence>
  )
}

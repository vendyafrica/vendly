'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChatMessages } from '../chat/chat-messages'
import { ChatInput } from '../chat/chat-input-wrapper'
import { AiTopbar } from '../ai-topbar'
import {
  type ImageAttachment,
  clearPromptFromStorage,
} from '../ai-elements/prompt-input'

// Component that uses useSearchParams - needs to be wrapped in Suspense
function SearchParamsHandler({ onReset }: { onReset: () => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const reset = searchParams.get('reset')
    if (reset === 'true') {
      onReset()

      // Remove the reset parameter from URL without triggering navigation
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('reset')
      window.history.replaceState({}, '', newUrl.pathname)
    }
  }, [searchParams, onReset])

  return null
}

export function HomeClient() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<ImageAttachment[]>([])
  const [chatHistory, setChatHistory] = useState<
    Array<{
      type: 'user' | 'assistant'
      content: string | unknown
      isStreaming?: boolean
      stream?: ReadableStream<Uint8Array> | null
    }>
  >([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleReset = () => {
    // Reset all chat-related state
    setChatHistory([])
    setMessage('')
    setAttachments([])
    setIsLoading(false)

    // Clear any stored data
    clearPromptFromStorage()

    // Focus textarea after reset
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }

  // Auto-focus the textarea on page load and restore from sessionStorage
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>,
    attachmentUrls?: Array<{ url: string }>,
  ) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()

    // Clear sessionStorage immediately upon submission
    clearPromptFromStorage()

    setMessage('')
    setAttachments([])
    setChatHistory((prev) => [...prev, { type: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          streaming: true,
          ...(attachmentUrls && attachmentUrls.length > 0
            ? { attachments: attachmentUrls }
            : {}),
        }),
      })

      if (!response.ok) {
        let errorMessage =
          'Sorry, there was an error processing your message. Please try again.'
        try {
          const errorData = await response.json()
          if (errorData?.message) {
            errorMessage = errorData.message
          } else if (response.status === 429) {
            errorMessage =
              'You have exceeded your maximum number of messages for the day. Please try again later.'
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
          if (response.status === 429) {
            errorMessage =
              'You have exceeded your maximum number of messages for the day. Please try again later.'
          }
        }
        throw new Error(errorMessage)
      }

      if (!response.body) {
        throw new Error('No response body for streaming')
      }

      setIsLoading(false)

      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: [],
          isStreaming: true,
          stream: response.body,
        },
      ])
    } catch (error) {
      console.error('Error creating chat:', error)
      setIsLoading(false)

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Sorry, there was an error processing your message. Please try again.'

      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: errorMessage,
        },
      ])
    }
  }

  const handleChatData = (chatData: { id?: string; object?: string }) => {
    if (chatData.id && chatData.object === 'chat') {
      window.history.pushState(null, '', `/chats/${chatData.id}`)

      fetch('/api/chat/ownership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatData.id,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create chat ownership')
          }
        })
        .catch((error) => {
          console.error('Failed to create chat ownership:', error)
        })
    }
  }

  const handleStreamingComplete = (finalContent: unknown) => {
    setIsLoading(false)

    setChatHistory((prev) => {
      const updated = [...prev]
      const lastIndex = updated.length - 1
      if (lastIndex >= 0 && updated[lastIndex].isStreaming) {
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: finalContent,
          isStreaming: false,
          stream: undefined,
        }
      }
      return updated
    })
  }

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <Suspense fallback={null}>
        <SearchParamsHandler onReset={handleReset} />
      </Suspense>

      <AiTopbar />

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ChatMessages
            chatHistory={chatHistory}
            isLoading={isLoading}
            currentChat={null}
            onStreamingComplete={handleStreamingComplete}
            onChatData={handleChatData}
            onStreamingStarted={() => setIsLoading(false)}
          />
        </div>

        <div className={chatHistory.length === 0 ? "flex-1 flex items-center justify-center" : ""}>
          <div className="w-full">
            <ChatInput
              message={message}
              setMessage={setMessage}
              onSubmit={handleSendMessage}
              isLoading={isLoading}
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              textareaRef={textareaRef}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
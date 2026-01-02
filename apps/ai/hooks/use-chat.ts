import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStreaming } from '@/contexts/streaming-context'
import useSWR, { mutate } from 'swr'

interface Chat {
  id: string
  demo?: string
  url?: string
  messages?: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    experimental_content?: any
    finishReason?: string
  }>
}

interface ChatMessage {
  type: 'user' | 'assistant'
  content: string | any
  isStreaming?: boolean
  stream?: ReadableStream<Uint8Array> | null
}

export function useChat(chatId: string) {
  const router = useRouter()
  const { handoff, clearHandoff } = useStreaming()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isResuming, setIsResuming] = useState(false)
  const resumedMessageIdsRef = (globalThis as any).__v0ResumedMessageIdsRef ||
    ((globalThis as any).__v0ResumedMessageIdsRef = new Set<string>())

  // Use SWR to fetch chat data
  const {
    data: currentChat,
    error,
    isLoading: isLoadingChat,
  } = useSWR<Chat>(chatId ? `/api/chats/${chatId}` : null, {
    onError: (error) => {
      console.error('Error loading chat:', error)
      // Redirect to home if chat not found
      router.push('/')
    },
    onSuccess: (chat) => {
      // Update chat history with existing messages when chat loads
      // But skip if we have a handoff (streaming from homepage) to avoid duplicates
      if (
        chat.messages &&
        chatHistory.length === 0 &&
        !(handoff.chatId === chatId && handoff.stream)
      ) {
        setChatHistory(
          chat.messages.map((msg) => ({
            type: msg.role,
            // Use experimental_content if available, otherwise fall back to plain content
            content: msg.experimental_content || msg.content,
          })),
        )
      }
    },
  })

  useEffect(() => {
    if (!chatId) return
    if (!currentChat?.messages || currentChat.messages.length === 0) return
    if (isStreaming || isResuming) return

    const last = currentChat.messages[currentChat.messages.length - 1]

    // When v0 returns finishReason 'tool-calls', generation is paused and must be resumed.
    if (last.role !== 'assistant') return
    if (last.finishReason !== 'tool-calls') return
    if (!last.id) return
    if (resumedMessageIdsRef.has(last.id)) return

    let cancelled = false

    const run = async () => {
      setIsResuming(true)
      setIsLoading(true)
      resumedMessageIdsRef.add(last.id)

      try {
        const resumeResponse = await fetch('/api/chat/resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, messageId: last.id }),
        })

        if (!resumeResponse.ok) {
          let msg = 'Failed to resume generation'
          try {
            const data = await resumeResponse.json()
            if (data?.error) msg = data.error
          } catch {}
          throw new Error(msg)
        }

        // Poll chat details briefly until the assistant message finishes.
        for (let i = 0; i < 10 && !cancelled; i++) {
          await new Promise((r) => setTimeout(r, 1200))
          const res = await fetch(`/api/chats/${chatId}`)
          if (!res.ok) continue

          const updated = (await res.json()) as Chat
          const updatedLast = updated?.messages?.[updated.messages.length - 1]
          const demoUrl = (updated as any)?.latestVersion?.demoUrl || updated?.demo

          mutate(
            `/api/chats/${chatId}`,
            {
              ...(updated as any),
              demo: demoUrl,
            },
            false,
          )

          if (
            updatedLast?.role === 'assistant' &&
            updatedLast.finishReason &&
            updatedLast.finishReason !== 'tool-calls'
          ) {
            break
          }
        }
      } catch (e) {
        console.error('Auto-resume failed:', e)
      } finally {
        if (!cancelled) {
          setIsResuming(false)
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [chatId, currentChat, isStreaming, isResuming, resumedMessageIdsRef])

  // Handle streaming from context (when redirected from homepage)
  useEffect(() => {
    if (handoff.chatId === chatId && handoff.stream && handoff.userMessage) {
      console.log('Continuing streaming from context for chat:', chatId)

      // Add the user message to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'user',
          content: handoff.userMessage!,
        },
      ])

      // Start streaming the assistant response
      setIsStreaming(true)
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: [],
          isStreaming: true,
          stream: handoff.stream,
        },
      ])

      // Clear the handoff immediately to prevent re-runs
      clearHandoff()
    }
  }, [chatId, handoff, clearHandoff])

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>,
    attachments?: Array<{ url: string }>,
  ) => {
    e.preventDefault()
    if (!message.trim() || isLoading || !chatId) return

    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)

    setChatHistory((prev) => [...prev, { type: 'user', content: userMessage }])

    try {
      // Use streaming mode
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatId: chatId,
          streaming: true,
          ...(attachments && attachments.length > 0 && { attachments }),
        }),
      })

      if (!response.ok) {
        // Try to get the specific error message from the response
        let errorMessage =
          'Sorry, there was an error processing your message. Please try again.'
        try {
          const errorData = await response.json()
          if (errorData.message) {
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

      setIsStreaming(true)
      // Keep isLoading true until streaming message has content

      // Add placeholder for streaming response with the stream attached
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
      console.error('Error:', error)

      // Use the specific error message if available, otherwise fall back to generic message
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
      setIsLoading(false)
    }
  }

  const handleStreamingComplete = async (finalContent: any) => {
    setIsStreaming(false)
    setIsLoading(false)

    console.log(
      'Stream completed with final content:',
      JSON.stringify(finalContent, null, 2),
    )

    // Always try to fetch updated chat details after streaming completes
    // This ensures we get the latest demoUrl even for existing chats
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      if (response.ok) {
        const chatDetails = await response.json()

        const demoUrl = chatDetails?.latestVersion?.demoUrl || chatDetails?.demo

        // Update SWR cache with the latest chat data
        mutate(
          `/api/chats/${chatId}`,
          {
            ...chatDetails,
            demo: demoUrl,
          },
          false,
        )
      } else {
        console.warn('Failed to fetch updated chat details:', response.status)
        // Fallback to just refreshing the cache
        mutate(`/api/chats/${chatId}`)
      }
    } catch (error) {
      console.error('Error fetching updated chat details:', error)
      // Fallback to just refreshing the cache
      mutate(`/api/chats/${chatId}`)
    }

    // Try to extract chat ID from the final content if we don't have one yet
    if (!currentChat && finalContent && Array.isArray(finalContent)) {
      let newChatId: string | undefined

      // Search through the content structure for chat ID
      const searchForChatId = (obj: any) => {
        if (obj && typeof obj === 'object') {
          // Look for chat ID - be more specific about what we accept
          if (obj.chatId && typeof obj.chatId === 'string') {
            // Validate that it looks like a real chat ID (UUID-like or specific format)
            if (obj.chatId.length > 10 && obj.chatId !== 'hello-world') {
              console.log('Accepting chatId:', obj.chatId)
              newChatId = obj.chatId
            }
          }

          // Only use 'id' if it's specifically a chat context and looks like a real ID
          if (!newChatId && obj.id && typeof obj.id === 'string') {
            // More restrictive check for 'id' field - should look like UUID or be longer
            if (
              (obj.id.includes('-') && obj.id.length > 20) ||
              (obj.id.length > 15 && obj.id !== 'hello-world')
            ) {
              console.log('Accepting id as chatId:', obj.id)
              newChatId = obj.id
            }
          }

          // Recursively search in arrays and objects
          if (Array.isArray(obj)) {
            obj.forEach(searchForChatId)
          } else {
            Object.values(obj).forEach(searchForChatId)
          }
        }
      }

      finalContent.forEach(searchForChatId)

      if (newChatId) {
        console.log('Found chat ID:', newChatId)
        console.log('Fetching chat details to get demo URL...')

        try {
          // Fetch the full chat details to get the demo URL
          const response = await fetch(`/api/chats/${newChatId}`)
          if (response.ok) {
            const chatDetails = await response.json()
            console.log('Chat details:', chatDetails)

            const demoUrl =
              chatDetails?.latestVersion?.demoUrl || chatDetails?.demo
            console.log('Demo URL from chat details:', demoUrl)

            // Update SWR cache with new chat data
            mutate(
              `/api/chats/${newChatId}`,
              {
                id: newChatId,
                demo: demoUrl || `Generated Chat ${newChatId}`,
              },
              false,
            )
          } else {
            console.warn('Failed to fetch chat details:', response.status)
            // Update SWR cache with new chat data
            mutate(
              `/api/chats/${newChatId}`,
              {
                id: newChatId,
                demo: `Generated Chat ${newChatId}`,
              },
              false,
            )
          }
        } catch (error) {
          console.error('Error fetching chat details:', error)
          // Update SWR cache with new chat data
          mutate(
            `/api/chats/${newChatId}`,
            {
              id: newChatId,
              demo: `Generated Chat ${newChatId}`,
            },
            false,
          )
        }
      } else {
        console.log('No chat ID found in final content')
      }
    }

    // Update chat history with the final content
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

  const handleChatData = async (chatData: any) => {
    if (chatData.id && !currentChat) {
      // Only update with basic chat data, without demo URL
      // The demo URL will be fetched in handleStreamingComplete
      mutate(
        `/api/chats/${chatData.id}`,
        {
          id: chatData.id,
          url: chatData.webUrl || chatData.url,
          // Don't set demo URL here - wait for streaming to complete
        },
        false,
      )
    }
  }

  return {
    message,
    setMessage,
    currentChat,
    isLoading,
    setIsLoading,
    isStreaming,
    chatHistory,
    isLoadingChat,
    handleSendMessage,
    handleStreamingComplete,
    handleChatData,
  }
}

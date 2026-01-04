'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ChatMessages } from '../chat/chat-messages'
import { ChatInput } from '../chat/chat-input'
import { useChat } from '../../hooks/use-chat'
import { AiTopbar } from '../ai-topbar'
import {
  type ImageAttachment,
  clearPromptFromStorage,
} from '../ai-elements/prompt-input'

export function ChatDetailClient() {
  const params = useParams()
  const chatId = params.chatId as string
  const [attachments, setAttachments] = useState<ImageAttachment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const {
    message,
    setMessage,
    currentChat,
    isLoading,
    setIsLoading,
    chatHistory,
    isLoadingChat,
    handleSendMessage,
    handleStreamingComplete,
    handleChatData,
  } = useChat(chatId)

  // Wrapper function to handle attachments
  const handleSubmitWithAttachments = (
    e: React.FormEvent<HTMLFormElement>,
    attachmentUrls?: Array<{ url: string }>,
  ) => {
    // Clear sessionStorage immediately upon submission
    clearPromptFromStorage()
    // Clear attachments after sending
    setAttachments([])
    return handleSendMessage(e, attachmentUrls)
  }

  // Auto-focus the textarea on page load
  useEffect(() => {
    if (textareaRef.current && !isLoadingChat) {
      textareaRef.current.focus()
    }
  }, [isLoadingChat])

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <AiTopbar />

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ChatMessages
            chatHistory={chatHistory}
            isLoading={isLoading}
            currentChat={currentChat || null}
            onStreamingComplete={handleStreamingComplete}
            onChatData={handleChatData}
            onStreamingStarted={() => setIsLoading(false)}
          />
        </div>

        <ChatInput
          message={message}
          setMessage={setMessage}
          onSubmit={handleSubmitWithAttachments}
          isLoading={isLoading}
          showSuggestions={false}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          textareaRef={textareaRef}
        />
      </div>
    </div>
  )
}

"use client";

import {
  PromptInput,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputProvider,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { ImageAttachment } from "@/components/ai-elements/prompt-input";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, attachmentUrls?: Array<{ url: string }>) => Promise<void>;
  isLoading: boolean;
  attachments: ImageAttachment[];
  onAttachmentsChange: (attachments: ImageAttachment[]) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export function ChatInput({
  message,
  setMessage,
  onSubmit,
  isLoading,
  attachments,
  onAttachmentsChange,
  textareaRef,
}: ChatInputProps) {
  const handleSubmit = async (promptMessage: PromptInputMessage) => {
    // Create a synthetic form event to match the expected interface
    const syntheticEvent = new Event('submit') as unknown as React.FormEvent<HTMLFormElement>;
    
    // Convert attachments to the expected format
    const attachmentUrls = promptMessage.files?.map(file => ({ url: file.url }));
    
    // Update the message state
    setMessage(promptMessage.text);
    
    // Call the original onSubmit handler
    await onSubmit(syntheticEvent, attachmentUrls);
  };

  const handleRemoveAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== id));
  };

  return (
    <PromptInputProvider initialInput={message}>
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputAttachments>
          {(attachment) => (
            <PromptInputAttachment data={attachment}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAttachment(attachment.id)}
                className="h-4 w-4 rounded p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </Button>
              {attachment.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={attachment.url}
                  alt="Attachment"
                  className="h-16 w-16 rounded object-cover"
                />
              )}
            </PromptInputAttachment>
          )}
        </PromptInputAttachments>
        
        <PromptInputBody>
          <PromptInputTextarea
            ref={textareaRef}
            placeholder="Type your message..."
            disabled={isLoading}
          />
        </PromptInputBody>
        
        <PromptInputFooter>
          <PromptInputSubmit disabled={isLoading} status={isLoading ? "submitted" : "ready"} />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
}

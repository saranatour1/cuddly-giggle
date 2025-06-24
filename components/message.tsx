'use client';
import { cn } from '@/lib/utils';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
// import { DocumentToolCall, DocumentToolResult } from './document';
// import { DocumentPreview } from './document-preview';
import { PencilEditIcon, SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { MessageEditor } from './message-editor';
import { MessageReasoning } from './message-reasoning';
import { PreviewAttachment } from './preview-attachment';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

import { useSmoothText, type UIMessage } from '@convex-dev/agent/react';


const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  requiresScrollPadding,
}: {
  chatId: string;
  message: UIMessage;
  isLoading: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [visibleText] = useSmoothText(message.content);
  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div
            className={cn('flex flex-col gap-4 w-full', {
              'min-h-96': message.role === 'assistant' && requiresScrollPadding,
            })}
          >
            {message.parts &&
              message.parts.length > 0 && (
                <div
                  data-testid={`message-attachments`}
                  className="flex flex-row justify-end gap-2"
                >
                  {message.parts.map((attachment) => {
                  return attachment.type === "file" ? (
                    <PreviewAttachment
                      key={attachment.mimeType}
                      attachment={{url:attachment.data}}
                    />
                  ) : null;
                })}
                </div>
              )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === 'reasoning') {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === 'text') {
                if (mode === 'view') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      {message.role === "user" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode('edit');
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn('flex flex-col gap-4', {
                          'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                            message.role === 'user',
                        })}
                      >
                        <Markdown>{visibleText}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === 'edit') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                      />
                    </div>
                  );
                }
              }

              // if (type === 'tool-invocation') {
              //   const { toolInvocation } = part;
              //   const { toolName, toolCallId, state } = toolInvocation;

              //   if (state === 'call') {
              //     const { args } = toolInvocation;

              //     return (
              //       <div
              //         key={toolCallId}
              //         className={cx({
              //           skeleton: ['getWeather'].includes(toolName),
              //         })}
              //       >
              //         {toolName === 'getWeather' ? (
              //           <Weather />
              //         ) : toolName === 'createDocument' ? (
              //           <DocumentPreview isReadonly={false} args={args} />
              //         ) : toolName === 'updateDocument' ? (
              //           <DocumentToolCall
              //             type="update"
              //             args={args}
              //             isReadonly={false}
              //           />
              //         ) : toolName === 'requestSuggestions' ? (
              //           <DocumentToolCall
              //             type="request-suggestions"
              //             args={args}
              //             isReadonly={false}
              //           />
              //         ) : null}
              //       </div>
              //     );
              //   }

              //   if (state === 'result') {
              //     const { result } = toolInvocation;

              //     return (
              //       <div key={toolCallId}>
              //         {toolName === 'getWeather' ? (
              //           <Weather weatherAtLocation={result} />
              //         ) : toolName === 'createDocument' ? (
              //           <DocumentPreview
              //             isReadonly={false}
              //             result={result}
              //           />
              //         ) : toolName === 'updateDocument' ? (
              //           <DocumentToolResult
              //             type="update"
              //             result={result}
              //             isReadonly={false}
              //           />
              //         ) : toolName === 'requestSuggestions' ? (
              //           <DocumentToolResult
              //             type="request-suggestions"
              //             result={result}
              //             isReadonly={false}
              //           />
              //         ) : (
              //           <pre>{JSON.stringify(result, null, 2)}</pre>
              //         )}
              //       </div>
              //     );
              //   }
              // }
            })}

              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                isLoading={isLoading}
              />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(PurePreviewMessage);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};

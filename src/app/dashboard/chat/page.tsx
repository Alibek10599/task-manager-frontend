'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useChat } from '../../../hooks/useChat';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function Chat() {
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    messages,
    getConversations,
    setConversation,
    sendMessage,
    loading,
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get all conversations on component mount
  useEffect(() => {
    getConversations();
  }, [getConversations]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !activeConversation) {
      return;
    }

    try {
      await sendMessage(activeConversation, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSelectConversation = (participantId: string) => {
    setConversation(participantId);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Chat
        </h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* Conversations List */}
        <div className='md:col-span-1'>
          <Card title='Conversations' className='h-[calc(80vh-160px)]'>
            {loading ? (
              <div className='space-y-4'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='animate-pulse p-4 rounded-md'>
                    <div className='flex items-center space-x-4'>
                      <div className='w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full'></div>
                      <div className='flex-1'>
                        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                        <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-gray-500 dark:text-gray-400'>
                  No conversations yet
                </p>
              </div>
            ) : (
              <div className='space-y-1 overflow-y-auto max-h-[calc(80vh-220px)]'>
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      activeConversation === conversation.participantId
                        ? 'bg-primary-light dark:bg-primary-dark'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() =>
                      handleSelectConversation(conversation.participantId)
                    }
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='flex-shrink-0'>
                        <div className='w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white'>
                          {conversation.participantName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                          {conversation.participantName}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className='inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full'>
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Messages Area */}
        <div className='md:col-span-3'>
          <Card className='h-[calc(80vh-160px)] flex flex-col'>
            {!activeConversation ? (
              <div className='flex flex-col items-center justify-center h-full text-center p-6'>
                <svg
                  className='w-16 h-16 text-gray-400 mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                  />
                </svg>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Select a conversation
                </h3>
                <p className='text-gray-500 dark:text-gray-400 mt-2'>
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            ) : (
              <>
                {/* Conversation Header */}
                <div className='border-b dark:border-gray-700 p-4 flex items-center'>
                  {/* Display active conversation participant's info */}
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white'>
                      {conversations
                        .find((c) => c.participantId === activeConversation)
                        ?.participantName.charAt(0)
                        .toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                        {conversations.find(
                          (c) => c.participantId === activeConversation
                        )?.participantName || 'Unknown User'}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className='flex-1 p-4 overflow-y-auto'>
                  {loading ? (
                    <div className='space-y-4'>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex ${
                            i % 2 === 0 ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`animate-pulse rounded-lg p-3 max-w-xs md:max-w-md ${
                              i % 2 === 0
                                ? 'bg-gray-200 dark:bg-gray-700'
                                : 'bg-primary-light dark:bg-primary-dark'
                            }`}
                          >
                            <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2'></div>
                            <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-full'></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className='flex items-center justify-center h-full text-center'>
                      <p className='text-gray-500 dark:text-gray-400'>
                        No messages yet. Start a conversation!
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {messages.map((message) => {
                        const isOwnMessage =
                          user && message.senderId === user.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isOwnMessage ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`rounded-lg p-3 max-w-xs md:max-w-md ${
                                isOwnMessage
                                  ? 'bg-primary-light text-primary-dark dark:bg-primary dark:text-white'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwnMessage
                                    ? 'text-primary-dark/70 dark:text-white/70'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {new Date(message.timestamp).toLocaleTimeString(
                                  [],
                                  { hour: '2-digit', minute: '2-digit' }
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className='border-t dark:border-gray-700 p-4'>
                  <form onSubmit={handleSendMessage} className='flex space-x-2'>
                    <Input
                      type='text'
                      placeholder='Type a message...'
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className='flex-1'
                    />
                    <Button type='submit' disabled={!messageInput.trim()}>
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                        />
                      </svg>
                    </Button>
                  </form>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

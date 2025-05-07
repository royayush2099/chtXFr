import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser,subscribeTOMessages,
    unsubscribeFromMessages
   } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
          }
          subscribeTOMessages();
          return ()=> unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages,subscribeTOMessages,unsubscribeFromMessages]);


  useEffect(()=>{
    if(messageEndRef.current && messages )
messageEndRef.current.scrollIntoView({behavior:"smooth"});
  },[messages])
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser?._id
                      ? authUser?.profilePic || '/avatar.png'
                      : selectedUser?.profilePic || '/avatar.png'
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </time>
            </div>
            <div className="chat-bubble flex-col">
        {message.image &&(
          <img
          src={message.image} 
          alt='"Attachment'
          className='sm:max-w-[200px] rounded-md b-2'
          />
        )}
              {message.text && <p>{message.text}</p> || 'No message content'}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;

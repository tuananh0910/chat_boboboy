import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import MessageItem from './MessageItem';

export default function MessageList({
  messages,
  currentUser,
  scollViewRef,
  onReply,
  onDelete,
  onEdit,
}) {
  return (
    <ScrollView
      ref={scollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 10 }}
    >
      {messages.map((message, index) => {
        return (
          <MessageItem
            key={message.id}
            message={message}
            currentUser={currentUser}
            onReply={onReply}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        );
      })}
    </ScrollView>
  );
}

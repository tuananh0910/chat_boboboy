import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import { useAuth } from '../../context/authContext';
import { getRoomId } from '../../utils/common';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function ChatRoom() {
  const { user } = useAuth();
  const item = useLocalSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);
  const textRef = useRef('');
  const inputRef = useRef(null);
  const scollViewRef = useRef(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, 'rooms', roomId);
    const messagesRef = collection(docRef, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsub = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(allMessages);
    });

    const KeyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      updateScollView
    );

    return () => {
      unsub();
      KeyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    updateScollView();
  }, [messages]);

  const updateScollView = () => {
    setTimeout(() => {
      scollViewRef?.current?.scrollToEnd({ animated: true }); // Đúng: scrollToEnd
    }, 300);
  };

  const handleSendMessage = async () => {
    const text = textRef.current.trim();
    if (!text) return;

    const roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, 'rooms', roomId);
    const messagesRef = collection(docRef, 'messages');

    await addDoc(messagesRef, {
      userId: user?.userId,
      text,
      replyTo: replyMessage,
      createdAt: Timestamp.fromDate(new Date()),
    });

    textRef.current = '';
    inputRef.current?.clear();
    setReplyMessage(null);
  };

  const handleDeleteMessage = async (messageId) => {
    const roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, 'rooms', roomId, 'messages', messageId);
    await deleteDoc(docRef);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setInputValue(message.text); // Cập nhật giá trị TextInput
    inputRef.current?.focus(); // Đưa con trỏ vào TextInput
  };

  const handleSaveEdit = async () => {
    const text = inputValue.trim();
    if (!text || !editingMessage) return;

    const roomId = getRoomId(user?.userId, item?.userId);
    const messageRef = doc(db, 'rooms', roomId, 'messages', editingMessage.id);

    await setDoc(messageRef, { text }, { merge: true });
    setEditingMessage(null);
    setInputValue(''); // Xóa nội dung sau khi lưu
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setInputValue(''); // Xóa nội dung TextInput
  };

  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <ChatRoomHeader user={item} router={router} />
        <View className="h-2 border-b border-neutral-300" />
        <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
          <View className="flex-1">
            <MessageList
              scollViewRef={scollViewRef}
              messages={messages}
              currentUser={user}
              onReply={setReplyMessage}
              onDelete={handleDeleteMessage}
              onEdit={handleEditMessage}
            />
          </View>
          {replyMessage && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: '#f0f0f0',
                marginHorizontal: wp(3),
                marginBottom: hp(1),
                borderRadius: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: hp(2) }}
                  className="text-indigo-500 font-bold"
                >
                  Replying to:
                </Text>
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="text-neutral-500 font-medium"
                >
                  {replyMessage.text}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setReplyMessage(null)}>
                <Feather name="x" size={hp(2.5)} color="red" />
              </TouchableOpacity>
            </View>
          )}
          <View style={{ marginBottom: hp(2.5) }} className="pt-2">
            <View className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5 items-center">
              <TextInput
                ref={inputRef}
                value={inputValue} // Kết nối với state inputValue
                onChangeText={setInputValue}
                placeholder={
                  editingMessage ? 'Edit message...' : 'Type message...'
                }
                className="flex-1 mr-2"
                style={{
                  fontSize: hp(2),
                  maxHeight: hp(12.5),
                  textAlignVertical: 'top',
                }}
                multiline={true}
                scrollEnabled={true}
              />
              {editingMessage ? (
                <>
                  {/* Nút Cancel */}
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    className="bg-neutral-200 rounded-full items-center justify-center mr-2"
                    style={{ height: hp(5), width: hp(5) }}
                  >
                    <Feather name="x" size={hp(2.7)} color="red" />
                  </TouchableOpacity>

                  {/* Nút Save */}
                  <TouchableOpacity
                    onPress={handleSaveEdit}
                    className="bg-neutral-200 rounded-full items-center justify-center"
                    style={{ height: hp(5), width: hp(5) }}
                  >
                    <Feather name="check" size={hp(2.7)} color="#737373" />
                  </TouchableOpacity>
                </>
              ) : (
                // Nút Send
                <TouchableOpacity
                  onPress={handleSendMessage}
                  className="bg-neutral-200 rounded-full items-center justify-center"
                  style={{ height: hp(5), width: hp(5) }}
                >
                  <Feather name="send" size={hp(2.7)} color="#737373" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}

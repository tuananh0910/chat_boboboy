import { View, Text } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Feather } from '@expo/vector-icons';
import { MenuItem } from './CustomMenuItems';

export default function MessageItem({
  message,
  currentUser,
  onReply,
  onDelete,
  onEdit,
}) {
  const isMyMessage = currentUser?.userId === message?.userId;

  return (
    <View
      className={`flex-row justify-end mb-3 ${
        isMyMessage ? 'self-end mr-3' : 'self-start ml-3 "'
      }`}
      style={{ maxWidth: wp(80) }}
    >
      <Menu>
        <MenuTrigger>
          <View
            className={`p-3 rounded-2xl border ${
              isMyMessage
                ? 'bg-white border-neutral-200'
                : 'bg-indigo-100 border-indigo-200'
            }`}
          >
            {message.replyTo && (
              <View className="mb-2">
                <Text
                  style={{
                    fontStyle: 'italic',
                    fontSize: hp(1.8),
                  }}
                  className="text-indigo-600 font-bold mb-2"
                >
                  Replying to:
                </Text>
                <Text
                  style={{
                    fontStyle: 'italic',
                    fontSize: hp(1.6),
                  }}
                  className="text-indigo-400 font-medium"
                >
                  {message.replyTo.text}
                </Text>
                <Divider />
              </View>
            )}
            <Text style={{ fontSize: hp(1.9) }}>{message?.text}</Text>
          </View>
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              borderRadius: 10,
              borderCurve: 'continuous',
              marginTop: 25,
              marginLeft: isMyMessage ? -40 : 40,
              backgroundColor: 'white',
              shadowOpacity: 0.2,
              shadowOffset: { height: 0, width: 0 },
              width: 160,
            },
          }}
        >
          <MenuItem
            text="Reply"
            action={() => onReply(message)}
            icon={<Feather name="corner-up-left" size={20} />}
          />
          {isMyMessage && (
            <View>
              <MenuItem
                text="Edit"
                action={() => onEdit(message)}
                icon={<Feather name="edit-3" size={20} />}
              />
              <MenuItem
                text="Delete"
                action={() => onDelete(message.id)}
                icon={<Feather name="trash-2" size={20} />}
              />
            </View>
          )}
        </MenuOptions>
      </Menu>
    </View>
  );
}

const Divider = () => {
  return <View className="h-px w-full bg-indigo-400" />;
};

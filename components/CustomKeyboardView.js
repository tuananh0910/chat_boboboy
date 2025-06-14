import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  Animated,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

const ios = Platform.OS == 'ios';

export default function CustomKeyboardView({ children, inChat }) {
  let kavConfig = {};
  let scollViewConfig = {};
  if (inChat) {
    kavConfig = { keyboardVerticalOffset: 90 };
    scollViewConfig = { contentContainerStyle: { flex: 1 } };
  }
  return (
    <KeyboardAvoidingView
      behavior={ios ? 'padding' : 'height'}
      style={{ flex: 1 }}
      {...kavConfig}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        {...scollViewConfig}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

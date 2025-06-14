// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
// Your web app's Firebase configuration
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD1BocqBQvYSduvHN0jW9OME-0AFFnAH4o',
  authDomain: 'fir-chat-be14d.firebaseapp.com',
  projectId: 'fir-chat-be14d',
  storageBucket: 'fir-chat-be14d.firebasestorage.app',
  messagingSenderId: '864955949346',
  appId: '1:864955949346:web:2a9e522e4f182bb1cec57b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const userRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');

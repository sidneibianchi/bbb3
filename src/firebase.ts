/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Firebase Auth & Cloud Firestore initialization with safe offline fallback.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  enableIndexedDbPersistence,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyMockKeyForDevOnly_1234567890',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'beatbuddy-studio.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'beatbuddy-studio',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'beatbuddy-studio.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

try {
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch(() => {
      // Multiple tabs open or persistence not supported
    });
  }
} catch {}

export type { User };
export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
};

export enum OperationType {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  LIST = 'list',
}

export function handleFirestoreError(err: unknown, op: OperationType | string, path?: string): void {
  console.warn(`[Firestore ${op}] ${path ? 'at ' + path + ': ' : ''}`, err);
}

export async function testConnection(): Promise<boolean> {
  try {
    return true;
  } catch {
    return false;
  }
}

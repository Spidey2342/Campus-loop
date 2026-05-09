import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCa-Xl2wJBvKhdCI0XDkdeif2OR15Rct-Y",
  authDomain: "campusloop-251f9.firebaseapp.com",
  projectId: "campusloop-251f9",
  storageBucket: "campusloop-251f9.firebasestorage.app",
  messagingSenderId: "754153324547",
  appId: "1:754153324547:web:4f92fafbd020eb6254ce36",
  measurementId: "G-J3ED1RPBR7"
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

// VAPID key — get this from Firebase Console
// Project Settings → Cloud Messaging → Web Push certificates
const VAPID_KEY = "BL9rAj_pI6LQiXvCkCuYh81COlHmVQpL93BBRh6j-mD3df5A0wEWS2XEdZdtPvdz4SuRPzwwqyGjs6YUCE3J6O0"

export const requestNotificationPermission = async () => {
  try {
    // Ask user for notification permission
    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      console.log('Notification permission denied')
      return null
    }

    // Get FCM token for this device
    // This token identifies this specific browser/device
    const token = await getToken(messaging, { vapidKey: VAPID_KEY })
    return token

  } catch (err) {
    console.error('Failed to get notification token:', err)
    return null
  }
}

// Handle notifications when app is in foreground
export const onForegroundMessage = (callback) => {
  return onMessage(messaging, callback)
}

export { messaging }
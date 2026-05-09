importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js')

// Same config as your React app
firebase.initializeApp({
   apiKey: "AIzaSyCa-Xl2wJBvKhdCI0XDkdeif2OR15Rct-Y",
  authDomain: "campusloop-251f9.firebaseapp.com",
  projectId: "campusloop-251f9",
  storageBucket: "campusloop-251f9.firebasestorage.app",
  messagingSenderId: "754153324547",
  appId: "1:754153324547:web:4f92fafbd020eb6254ce36",
  measurementId: "G-J3ED1RPBR7"
})

const messaging = firebase.messaging()

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification

  self.registration.showNotification(title, {
    body,
    icon: icon || '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    vibrate: [200, 100, 200],
    data: payload.data,
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  })
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  // Open the app when notification is tapped
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If app is already open focus it
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
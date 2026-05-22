import { useEffect, useRef } from 'react'
import { requestNotificationPermission, onForegroundMessage } from '../services/firebase'
import { saveFCMToken } from '../services/api'

export function useNotifications() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const token = localStorage.getItem('token')
    if (!token) return

    const setup = async () => {
      try {
        const fcmToken = await requestNotificationPermission()
        if (fcmToken) {
          const lastToken = localStorage.getItem('fcm_token')
          if (fcmToken !== lastToken) {
            await saveFCMToken(fcmToken, token)
            localStorage.setItem('fcm_token', fcmToken)
          }
        }

        onForegroundMessage((payload) => {
          window.dispatchEvent(new CustomEvent('campusvibe-notification', {
            detail: {
              title: payload.notification?.title || 'CampusVibe',
              body:  payload.notification?.body  || '',
              url:   payload.data?.url || '/',
            }
          }))
        })

      } catch (err) {
        console.error('Notification setup:', err)
      }
    }

    const timer = setTimeout(setup, 2000)
    return () => clearTimeout(timer)
  }, [])
}
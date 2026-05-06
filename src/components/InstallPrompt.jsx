import React, { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    if (isInstalled) return

    // Check if already dismissed recently
    const dismissed = localStorage.getItem('pwa-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      // Show again after 3 days
      if (Date.now() - dismissedTime < 3 * 24 * 60 * 60 * 1000) return
    }

    // Detect iOS
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    setIsIOS(ios)

    if (ios) {
      // iOS doesn't support beforeinstallprompt
      // Show manual guide after 30 seconds
      setTimeout(() => setShowPrompt(true), 30000)
    } else {
      // Android/Desktop — listen for install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        // Show after 20 seconds so user has time to explore first
        setTimeout(() => setShowPrompt(true), 20000)
      })
    }
  }, [])

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true)
      return
    }

    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice

    if (result.outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowIOSGuide(false)
    // Remember dismissal time
    localStorage.setItem('pwa-dismissed', Date.now().toString())
  }

  // iOS install guide
  if (showIOSGuide) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center px-4 pb-8">
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-lg">Install CampusVibe</h3>
            <button onClick={handleDismiss}>
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-teal-400 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Tap the Share button</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  The box with an arrow at the bottom of Safari
                </p>
                <p className="text-2xl mt-1">⬆️</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-teal-400 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Tap "Add to Home Screen"</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Scroll down in the share menu to find it
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-teal-400 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Tap "Add"</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  CampusVibe will appear on your home screen
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full mt-6 bg-teal-500 py-3 rounded-xl text-black font-semibold text-sm"
          >
            Got it!
          </button>
        </div>
      </div>
    )
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40">
      <div className="bg-gray-900 rounded-2xl p-4 border border-teal-500/30 shadow-lg shadow-teal-500/10">
        <div className="flex items-start gap-3">

          {/* App icon */}
          <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-lg">CV</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">
              Install CampusVibe
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              Add to your home screen for the best experience
            </p>
          </div>

          <button onClick={handleDismiss} className="text-gray-500 flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2 rounded-xl border border-white/10 text-gray-400 text-sm"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2 rounded-xl bg-teal-500 text-black font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Download size={14} />
            Install
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt
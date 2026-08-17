import React, { useState } from 'react'
import { Video, Mail, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = 'https://chale.alwaysdata.net'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Something went wrong')
      }
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white flex flex-col items-center justify-center px-4'>

      <div className='mb-8'>
        <div className='bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm flex items-center gap-2'>
          <Video /> <span className="font-medium">CampusVibe</span>
        </div>
      </div>

      <div className='w-full max-w-md bg-white/10 rounded-2xl border border-white/30 p-6'>

        {sent ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-14 h-14 bg-teal-500/20 rounded-full flex items-center justify-center">
              <CheckCircle size={28} className="text-teal-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Check your email</h2>
              <p className="text-gray-400 text-sm">
                If an account exists with <span className="text-white">{email}</span>, we've sent a password reset link. It expires in 30 minutes.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="mt-2 text-teal-400 text-sm underline"
            >
              Back to login
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-teal-400" />
              </div>
              <h2 className="text-xl font-bold">Forgot password?</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Enter the email linked to your account and we'll send you a reset link.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full p-4 rounded-xl bg-white/10 outline-none mb-3"
            />

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm px-4 py-3 rounded-xl mb-3">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 py-4 rounded-2xl font-semibold transition-all"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            <p
              onClick={() => navigate('/login')}
              className="text-center text-gray-400 text-sm mt-4 cursor-pointer"
            >
              Back to <span className="text-teal-400">Log In</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
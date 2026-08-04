import React, { useState } from 'react'
import { Video, Lock, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const BASE_URL = 'https://code-dreams-backend.onrender.com'

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const handleSubmit = async () => {
    setError('')

    if (!token) {
      setError('Invalid or missing reset link')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.detail || 'Reset failed')
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
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

        {!token ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <XCircle size={40} className="text-red-400" />
            <h2 className="text-xl font-bold">Invalid link</h2>
            <p className="text-gray-400 text-sm">This reset link is missing or broken. Please request a new one.</p>
            <button onClick={() => navigate('/forgot-password')} className="text-teal-400 text-sm underline">
              Request new link
            </button>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <CheckCircle size={40} className="text-teal-400" />
            <h2 className="text-xl font-bold">Password reset!</h2>
            <p className="text-gray-400 text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock size={18} className="text-teal-400" />
              </div>
              <h2 className="text-xl font-bold">Reset password</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">Choose a new password for your account.</p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full p-4 rounded-xl bg-white/10 outline-none mb-3"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
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
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
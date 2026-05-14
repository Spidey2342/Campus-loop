import React, { useState } from 'react'
import { X, Flag, AlertTriangle } from 'lucide-react'
import { reportReel, reportUser } from '../../services/api'

const REASONS = [
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "spam",          label: "Spam or misleading" },
  { value: "harassment",    label: "Harassment or bullying" },
  { value: "misinformation", label: "Misinformation" },
  { value: "other",         label: "Something else" },
]

// Usage:
//   <ReportModal reelId="abc" onClose={() => setShowReport(false)} />
//   <ReportModal reportedUserId="xyz" onClose={() => setShowReport(false)} />
function ReportModal({ reelId, reportedUserId, onClose }) {
  const [step, setStep]       = useState("reason")   // "reason" | "details" | "done"
  const [reason, setReason]   = useState("")
  const [details, setDetails] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const token = localStorage.getItem("token")

  const handleSubmit = async () => {
    if (!reason) return
    setLoading(true)
    setError("")
    try {
      if (reelId) {
        await reportReel({ reelId, reason, details }, token)
      } else {
        await reportUser({ reportedUserId, reason, details }, token)
      }
      setStep("done")
    } catch (err) {
      // 409 = already reported
      if (err.message?.includes("already reported")) {
        setStep("done")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 w-full max-w-lg rounded-t-3xl border border-white/10 p-6 pb-10 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        {step === "done" ? (
          // ── Confirmation ──
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-14 h-14 bg-teal-500/20 rounded-full flex items-center justify-center">
              <Flag size={26} className="text-teal-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Report submitted</p>
              <p className="text-gray-400 text-sm mt-1">
                Thanks for keeping CampusVibe safe. Our team will review this shortly.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 bg-white/10 px-8 py-2.5 rounded-full text-sm text-white"
            >
              Done
            </button>
          </div>

        ) : step === "details" ? (
          // ── Optional details ──
          <>
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setStep("reason")} className="text-gray-400 text-sm">← Back</button>
              <h2 className="text-white font-semibold">Add details</h2>
              <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
            </div>

            <p className="text-gray-400 text-sm mb-3">
              Help us understand the issue better (optional).
            </p>

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what's wrong..."
              maxLength={500}
              rows={4}
              className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none resize-none"
            />
            <p className="text-gray-600 text-xs text-right mt-1">{details.length}/500</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mt-3">
                <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-5 bg-red-500 hover:bg-red-600 transition py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit report"}
            </button>
          </>

        ) : (
          // ── Pick a reason ──
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">Report</h2>
              <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
            </div>

            <p className="text-gray-400 text-sm mb-4">Why are you reporting this?</p>

            <div className="space-y-2">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setReason(r.value)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all ${
                    reason === r.value
                      ? "bg-red-500/20 border border-red-500/50 text-white"
                      : "bg-white/10 border border-transparent text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {r.label}
                  {reason === r.value && (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("details")}
              disabled={!reason}
              className="w-full mt-5 bg-red-500 hover:bg-red-600 transition py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ReportModal
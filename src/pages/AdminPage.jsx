import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle, Eye, Filter } from 'lucide-react'
import { getReports, reviewReport } from '../services/api'

const STATUS_TABS = [
  { value: "pending",   label: "Pending" },
  { value: "actioned",  label: "Actioned" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all",       label: "All" },
]

const REASON_LABELS = {
  inappropriate:   "Inappropriate",
  spam:            "Spam",
  harassment:      "Harassment",
  misinformation:  "Misinformation",
  other:           "Other",
}

const REASON_COLORS = {
  inappropriate:  "bg-red-900/40 text-red-400",
  spam:           "bg-yellow-900/40 text-yellow-400",
  harassment:     "bg-orange-900/40 text-orange-400",
  misinformation: "bg-blue-900/40 text-blue-400",
  other:          "bg-gray-800 text-gray-400",
}

function AdminPage() {
  const navigate = useNavigate()
  const [reports, setReports]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [statusTab, setStatusTab] = useState("pending")
  const [acting, setActing]       = useState({}) // reportId -> true while in-flight
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  // Redirect non-admins away immediately
  useEffect(() => {
    if (!currentUser.is_admin) {
      navigate("/feed", { replace: true })
    }
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const data = await getReports(token, statusTab)
      setReports(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [statusTab])

  const handleAction = async (reportId, newStatus) => {
    setActing(prev => ({ ...prev, [reportId]: true }))
    try {
      await reviewReport(reportId, newStatus, token)
      // Remove from current list (it's moved to another status)
      setReports(prev => prev.filter(r => r.id !== reportId))
    } catch (err) {
      console.error(err)
    } finally {
      setActing(prev => ({ ...prev, [reportId]: false }))
    }
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ""
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  if (!currentUser.is_admin) return null

  return (
    <div className="min-h-screen bg-black text-white pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 sticky top-0 bg-black z-10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Shield size={18} className="text-teal-400" />
          <h1 className="font-bold text-lg">Moderation</h1>
        </div>
        <span className="text-xs text-gray-500">
          {reports.length} report{reports.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 px-4 py-3 border-b border-white/10 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusTab(tab.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              statusTab === tab.value
                ? "bg-teal-500 text-black"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <CheckCircle size={40} className="text-teal-600" />
          <p className="text-gray-400 font-semibold">All clear</p>
          <p className="text-gray-600 text-sm">No {statusTab === "all" ? "" : statusTab} reports</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {reports.map((report) => (
            <div key={report.id} className="px-4 py-4">

              {/* Report header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${REASON_COLORS[report.reason] || REASON_COLORS.other}`}>
                    {REASON_LABELS[report.reason] || report.reason}
                  </span>
                  {report.status !== "pending" && (
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      report.status === "actioned"  ? "bg-red-900/40 text-red-400" :
                      report.status === "dismissed" ? "bg-gray-800 text-gray-500" :
                      "bg-white/10 text-gray-400"
                    }`}>
                      {report.status}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">
                  {formatTime(report.created_at)}
                </span>
              </div>

              {/* What was reported */}
              <div className="bg-white/5 rounded-xl p-3 mb-3 space-y-2">
                {/* Reported reel */}
                {report.reel_id && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-16 flex-shrink-0">Reel</span>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {report.reel_video_url && (
                        <div className="w-10 h-14 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          <video
                            src={report.reel_video_url}
                            className="w-full h-full object-cover"
                            muted
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">
                          {report.reel_caption || "(no caption)"}
                        </p>
                        <button
                          onClick={() => navigate(`/reel/${report.reel_id}`)}
                          className="text-xs text-teal-400 flex items-center gap-1 mt-0.5"
                        >
                          <Eye size={10} /> View reel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reported user */}
                {report.reported_user_id && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-16 flex-shrink-0">User</span>
                    <button
                      onClick={() => navigate(`/profile/${report.reported_username}`)}
                      className="text-sm text-teal-400"
                    >
                      @{report.reported_username}
                    </button>
                  </div>
                )}

                {/* Reporter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16 flex-shrink-0">Reporter</span>
                  <span className="text-xs text-gray-400">@{report.reporter_username}</span>
                </div>

                {/* Details */}
                {report.details && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 w-16 flex-shrink-0 mt-0.5">Note</span>
                    <p className="text-xs text-gray-300 leading-relaxed">{report.details}</p>
                  </div>
                )}
              </div>

              {/* Action buttons — only for pending */}
              {report.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(report.id, "actioned")}
                    disabled={acting[report.id]}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/20 border border-red-500/40 text-red-400 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500/30 transition disabled:opacity-40"
                  >
                    <AlertTriangle size={14} />
                    {acting[report.id] ? "..." : "Action"}
                  </button>
                  <button
                    onClick={() => handleAction(report.id, "reviewed")}
                    disabled={acting[report.id]}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition disabled:opacity-40"
                  >
                    <Eye size={14} />
                    {acting[report.id] ? "..." : "Reviewed"}
                  </button>
                  <button
                    onClick={() => handleAction(report.id, "dismissed")}
                    disabled={acting[report.id]}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 text-gray-500 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition disabled:opacity-40"
                  >
                    <XCircle size={14} />
                    {acting[report.id] ? "..." : "Dismiss"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPage
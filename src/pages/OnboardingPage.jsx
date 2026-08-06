import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Check, UserPlus, BadgeCheck, Crown } from 'lucide-react'
import SchoolPicker from '../components/layouts/SchoolPicker'
import { editProfile, followUser, getOnboardingSuggestions, completeOnboarding } from '../services/api'

function OnboardingPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}")

  const [step, setStep] = useState("school") // "school" | "follow"

  // --- Step 1: school ---
  const [school, setSchool] = useState(storedUser.school_name || "")
  const [savingSchool, setSavingSchool] = useState(false)

  // --- Step 2: follow suggestions ---
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [followingIds, setFollowingIds] = useState(new Set())
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    if (step !== "follow") return
    setSuggestionsLoading(true)
    getOnboardingSuggestions(token)
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
      .finally(() => setSuggestionsLoading(false))
  }, [step])

  const handleConfirmSchool = async () => {
    if (!school.trim() || savingSchool) return
    setSavingSchool(true)
    try {
      const formData = new FormData()
      formData.append("school_name", school.trim())
      const result = await editProfile(formData, token)
      // Keep localStorage's cached user in sync so other pages (e.g.
      // Marketplace's "My campus only" toggle) see the confirmed school
      // immediately without needing a fresh /auth/me call.
      localStorage.setItem("user", JSON.stringify({ ...storedUser, school_name: result.user.school_name }))
      setStep("follow")
    } catch (err) {
      console.error(err)
    } finally {
      setSavingSchool(false)
    }
  }

  const handleToggleFollow = async (username, userId) => {
    setFollowingIds((prev) => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
    try {
      await followUser(username, token)
    } catch (err) {
      // roll back optimistic toggle on failure
      setFollowingIds((prev) => {
        const next = new Set(prev)
        next.has(userId) ? next.delete(userId) : next.add(userId)
        return next
      })
    }
  }

  const finishOnboarding = async () => {
    if (finishing) return
    setFinishing(true)
    try {
      await completeOnboarding(token)
    } catch (err) {
      console.error(err)
    }
    localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user") || "{}"), has_completed_onboarding: true }))
    navigate("/feed", { replace: true })
  }

  const getInitials = (name) => (name || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-8 pb-2">
        <div className={`h-1.5 rounded-full transition-all ${step === "school" ? "w-8 bg-teal-400" : "w-6 bg-teal-400/40"}`} />
        <div className={`h-1.5 rounded-full transition-all ${step === "follow" ? "w-8 bg-teal-400" : "w-6 bg-white/15"}`} />
      </div>

      {step === "school" ? (
        <div className="flex-1 flex flex-col px-6 pt-10">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/15 flex items-center justify-center mb-5">
            <GraduationCap size={26} className="text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Confirm your school</h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            This decides what shows up in your feed and marketplace by default — you can always browse everywhere too.
          </p>

          <SchoolPicker
            value={school}
            onChange={setSchool}
            placeholder="Search your university..."
          />

          <div className="flex-1" />

          <button
            onClick={handleConfirmSchool}
            disabled={!school.trim() || savingSchool}
            className="w-full bg-teal-500 text-black py-4 rounded-xl font-semibold disabled:opacity-40 mb-8"
          >
            {savingSchool ? "Saving..." : "Confirm & Continue"}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-6 pt-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold">Follow people to get started</h1>
            <button onClick={finishOnboarding} className="text-sm text-gray-400 flex-shrink-0">
              Skip
            </button>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Suggested for you at {school || "your school"} and beyond.
          </p>

          <div className="flex-1 overflow-y-auto -mx-2 px-2 pb-4">
            {suggestionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">
                No suggestions yet — you're one of the first here!
              </p>
            ) : (
              <div className="space-y-2.5">
                {suggestions.map((user) => {
                  const isFollowing = followingIds.has(user.id)
                  return (
                    <div key={user.id} className="flex items-center gap-3 bg-white/[0.06] rounded-xl p-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {getInitials(user.full_name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium truncate">{user.full_name}</p>
                          {user.is_verified && <BadgeCheck size={13} className="text-teal-400 flex-shrink-0" />}
                          {user.is_founding_member && <Crown size={12} className="text-amber-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          @{user.username}{user.school_name ? ` · ${user.school_name}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleFollow(user.username, user.id)}
                        className={`flex-shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isFollowing ? "bg-white/10 text-gray-300" : "bg-teal-500 text-black"
                        }`}
                      >
                        {isFollowing ? <><Check size={12} /> Following</> : <><UserPlus size={12} /> Follow</>}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <button
            onClick={finishOnboarding}
            disabled={finishing}
            className="w-full bg-teal-500 text-black py-4 rounded-xl font-semibold disabled:opacity-60 mb-8"
          >
            {finishing ? "Taking you in..." : "Continue to Feed"}
          </button>
        </div>
      )}
    </div>
  )
}

export default OnboardingPage
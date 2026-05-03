import React, { useState, useRef } from 'react'
import { editProfile } from '../../services/api'
import { Camera } from 'lucide-react'

function EditProfileModal({ profile, token, onClose, onSave }) {
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    school_name: profile.school_name || "",
    programme: profile.programme || "",
    year_of_study: profile.year_of_study || "",
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setAvatarFile(file)

    // Show preview immediately before uploading
    // URL.createObjectURL creates a temporary local URL for the file
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
  }

  const handleSave = async () => {
    setLoading(true)
    setError("")

    try {
      // FormData is required because we're sending a file + text together
      const formData = new FormData()

      // Only append fields that have values
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      // Append avatar file if user picked one
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const data = await editProfile(formData, token)
      onSave(data.user)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Generate initials from name for the placeholder avatar
  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
      <div className="bg-gray-900 w-full max-w-md rounded-t-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
        </div>

        {/* Avatar picker */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="relative">

            {avatarPreview ? (
              // Show image if they have one or picked one
              <img
                src={avatarPreview}
                className="w-24 h-24 rounded-full object-cover border-2 border-teal-500"
                alt="avatar"
              />
            ) : (
              // No image yet — show initials placeholder
              <div className="w-24 h-24 rounded-full bg-teal-900 border-2 border-teal-500 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {getInitials(form.full_name || profile.full_name)}
                </span>
              </div>
            )}

            {/* Camera icon overlay — tap to change photo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-2 border-2 border-gray-900"
            >
              <Camera size={14} className="text-black" />
            </button>

          </div>

          <p className="text-gray-400 text-xs">
            Tap the camera to change your photo
          </p>

          {/* Hidden file input — triggered by camera button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Form fields */}
        {[
          { label: "Full name", name: "full_name", placeholder: "Your full name" },
          { label: "Bio", name: "bio", placeholder: "Tell your campus about yourself" },
          { label: "School", name: "school_name", placeholder: "Your school name" },
          { label: "Programme", name: "programme", placeholder: "e.g. BSc Computer Science" },
          { label: "Year", name: "year_of_study", placeholder: "e.g. Year 2" },
        ].map(({ label, name, placeholder }) => (
          <div key={name}>
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full bg-white/10 rounded-xl p-3 text-sm text-white outline-none placeholder-gray-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        ))}

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-xl">
            {error}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 py-3 rounded-xl font-semibold text-white transition-all"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  )
}

export default EditProfileModal
import React from 'react'
import { useState } from 'react';
import { Video } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { registerUser } from '../services/api';
import SchoolPicker from '../components/layouts/SchoolPicker';

function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    school: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setError("")

    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields")
      return
    }

    if (!form.school) {
      setError("Please select your school")
      return
    }

    const cleanUsername = form.username
      .replace("@", "")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._]/g, "")

    setLoading(true)

    try {
      const data = await registerUser({
        full_name: form.username,
        username: cleanUsername,
        email: form.email,
        password: form.password,
        school_name: form.school,
      })

      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      navigate(data.user.has_completed_onboarding ? "/feed" : "/onboarding")

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white flex flex-col items-center justify-between px-2 py-8'>

      {/* Header */}
      <div className='mt-4'>
        <div className='bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm flex items-center gap-2'>
          <Video /> <span className="font-medium">CampusReel</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">Join the Reel</h1>
      <p className="text-gray-400 mb-6 text-center px-1.5">
        Create your account and connect with your campus
      </p>

      <div className='w-full bg-white/10 max-w-md space-y-4 flex flex-col justify-center items-center rounded-2xl border-1 border-white/30 align-middle px-1.5'>

        <div className='w-[95%] mt-6'>
          <p className='font-small text-white/70 text-sm'>USERNAME:</p>
          <input
            type="text"
            name='username'
            placeholder='@your_handle'
            onChange={handleChange}
            className='w-full p-4 rounded-xl bg-white/10 outline-none' />
        </div>

        <div className='w-[95%]'>
          <p className='font-small text-white/70 text-sm'>SCHOOL:</p>
          <SchoolPicker
            value={form.school}
            onChange={(name) => setForm({ ...form, school: name })}
            placeholder="Search your university..."
          />
        </div>

        <div className='w-[95%]'>
          <p className='font-small text-white/70 text-sm'>EMAIL:</p>
          <input
            type="email"
            name="email"
            placeholder="you@school.edu"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/10 outline-none"
          />
        </div>

        <div className='w-[95%]'>
          <p className='font-small text-white/70 text-sm'>PASSWORD:</p>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/10 outline-none"
          />
        </div>

        {error && (
          <div className="w-[95%] bg-red-500/20 border border-red-500/50 text-red-300 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl font-semibold mb-4 transition-all"
        >
          {loading ? "Creating account..." : "Sign Up →"}
        </button>

      </div>

      <p className="text-gray-400 mt-6">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-teal-400 cursor-pointer"
        >
          Log In
        </span>
      </p>

    </div>
  )
}

export default SignUp
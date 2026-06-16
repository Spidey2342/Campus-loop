import React from "react";
import { Video, CircleUser } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // 👈 import our API service

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // These were missing from your original — needed for feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignIn = async () => {
    // Clear previous errors
    setError("");

    // Validate first before hitting the server
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Call POST /auth/login on our Python backend
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      // Save token and user to localStorage
      // Same pattern as signup — the wristband stays on
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Success — go to where they came from or feed
      const redirect = localStorage.getItem('redirect_after_login')
      if (redirect) {
        localStorage.removeItem('redirect_after_login')
        navigate(redirect)
      } else {
        navigate('/feed')
      }

    } catch (err) {
      // Show the error from the server e.g. "Invalid email or password"
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white flex flex-col items-center justify-between px-2 py-8">
      
      {/* Header */}
      <div className="mt-4">
        <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm flex items-center gap-2">
          <Video /> <span className="font-medium">CampusReel</span>
        </div>
      </div>

      {/* Avatar */}
      <div className="w-20 h-20 flex justify-center items-center rounded-2xl border-1 border-white/30 mt-4">
        <div className="h-12 w-12 flex justify-center items-center bg-teal-900 rounded-full">
          <CircleUser className="h-20" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
      <p className="text-gray-400 mb-6 text-center px-1.5">
        Sign in to continue your campus community
      </p>

      {/* Form */}
      <div className='w-full bg-white/10 max-w-md space-y-4 flex flex-col justify-center items-center rounded-2xl border-1 border-white/30 align-middle px-1.5'>
        
        <div className='w-[95%] mt-5'>
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
            placeholder="Your password"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/10 outline-none"
          />
        </div>

        {/* Error message — only shows when there's an error */}
        {error && (
          <div className="w-[95%] bg-red-500/20 border border-red-500/50 text-red-300 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Forgot password — good UX to have early */}
        <div className="w-[95%] text-right">
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-teal-400 text-sm cursor-pointer hover:underline"
          >
            Forgot password?
          </span>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl font-semibold mb-4 transition-all"
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

      </div>

      {/* Sign up link */}
      <p className="text-gray-400 mt-6">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-teal-400 cursor-pointer hover:underline"
        >
          Sign Up
        </span>
      </p>

    </div>
  );
}

export default Login;
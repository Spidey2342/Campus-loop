import React from "react";
import { Video, CircleUser } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { auth } from "../services/firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
    const navigate = useNavigate()
const [form, setForm] = useState({
  email: "",
  password: "",
});

     const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSignIn = async () => {
     alert(error.message);
       if (!form.email || !form.password) {
  alert("Please fill all fields");
  return;
}
 
 
    navigate("/feed");
 
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white flex flex-col items-center justify-between px-2 py-8">
      {/* Header */}
      <div className="mt-4">
        <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm flex items-center gap-2">
          <Video /> <span className="font-medium">CampusReel</span>
        </div>
      </div>
      {/* avatar */}
      <div className="w-20 h-20 flex justify-center items-center rounded-2xl border-1 border-white/30 mt-4">
        <div className="h-12 w-12 flex justify-center items-center bg-teal-900 rounded-full">
          <CircleUser className="h-20" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
      <p className="text-gray-400 mb-6 text-center px-1.5">
        Sign in to continue your campus community
      </p>


{/* forms */}
<div className='w-full bg-white/10  max-w-md space-y-4 flex flex-col justify-center items-center rounded-2xl border-1 border-white/30 align-middle px-1.5'>
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
          placeholder="Create password"
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/10 outline-none"
        />

</div>

 <button
          onClick={() => navigate("/feed")}
          className="w-full bg-teal-600 hover:bg-teal-500 py-4 rounded-2xl font-semibold mb-4"
        >
          Sign In →
        </button>

</div>
{/* login */}
 <p className="text-gray-400 mt-6">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/Signup")}
          className="text-teal-400 cursor-pointer"
        >
         Sign Up
        </span>
      </p>

    </div>
  );
}

export default Login;

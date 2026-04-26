import React from 'react'
import { useState } from 'react';
import { Video } from 'lucide-react'
import { useNavigate } from "react-router-dom";

// import { auth, db } from "../services/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";


function SignUp() {
    const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    school: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
   const handleSignup = async () => {
   

      navigate("/feed");

  };
  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 text-white flex flex-col items-center justify-between px-2 py-8'>

{/* Header */}
<div
className='mt-4'>
    <div className='bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm flex items-center gap-2'>
     <Video /> <span className="font-medium">CampusReel</span>
   
    </div>
</div>

  <h1 className="text-3xl font-bold mb-2">Join the Reel</h1>
      <p className="text-gray-400 mb-6 text-center px-1.5">
        Create your account and connect with your campus
      </p>

{/* forms */}

<div className='w-full bg-white/10  max-w-md space-y-4 flex flex-col justify-center items-center rounded-2xl border-1 border-white/30 align-middle px-1.5'>
   

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
   <input
          type="text"
          name="school"
          placeholder="Your School"
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/10 outline-none"
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
    
   <button
          onClick={handleSignup}
          className="w-full bg-teal-600 hover:bg-teal-500 py-4 rounded-2xl font-semibold mb-4"
        >
          Sign Up →
        </button>
</div>

{/* login */}
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
import React, { useState } from 'react'
import { Home, Compass, Plus, ShoppingBag, User, MessageCircle, Bell, LogOut } from "lucide-react"
import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login", { replace: true })
  }

  const NavItem = ({ path, icon: Icon, label, exact = false }) => {
    const active = exact ? location.pathname === path : isActive(path)
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center gap-4 w-full px-3 py-3 rounded-xl transition-colors ${
          active ? "bg-white/10 text-teal-400" : "text-gray-300 hover:bg-white/5"
        }`}
      >
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        <span className={`text-[15px] ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
      </button>
    )
  }

  return (
    <>
      {/* Desktop only — BottomNav handles mobile */}
      <div className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-60 border-r border-white/10 bg-black px-3 py-6 z-40">
        <button
          onClick={() => navigate("/feed")}
          className="text-xl font-bold px-3 mb-8 text-left"
        >
          Campus<span className="text-teal-400">Vibe</span>
        </button>

        <nav className="flex flex-col gap-1 flex-1">
          <NavItem path="/feed" icon={Home} label="Home" exact />
          <NavItem path="/discover" icon={Compass} label="Discover" />
          <NavItem path="/notifications" icon={Bell} label="Notifications" />
          <NavItem path="/messages" icon={MessageCircle} label="Messages" />
          <NavItem path="/marketplace" icon={ShoppingBag} label="Marketplace" exact />
          <NavItem path="/profile" icon={User} label="Profile" exact />

          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-4 w-full px-3 py-3 mt-2 rounded-xl bg-teal-500 text-black font-semibold"
          >
            <Plus size={22} />
            <span className="text-[15px]">Create</span>
          </button>
        </nav>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-4 w-full px-3 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>

      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden lg:flex items-center justify-center px-6"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-gray-900 w-full max-w-sm rounded-2xl p-6 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-lg font-semibold mb-2">Log out?</h2>
            <p className="text-gray-400 text-sm mb-6">
              You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-white/10 py-3 rounded-xl text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 py-3 rounded-xl text-white text-sm font-semibold"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
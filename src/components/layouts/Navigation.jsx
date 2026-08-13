import React from 'react'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

// Single nav import for every page — renders the right one per breakpoint.
// BottomNav hides itself on desktop (lg:hidden), Sidebar hides itself on
// mobile (hidden lg:flex), so this always shows exactly one.
function Navigation() {
  return (
    <>
      <BottomNav />
      <Sidebar />
    </>
  )
}

export default Navigation
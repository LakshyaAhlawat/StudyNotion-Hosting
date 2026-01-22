import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { HiMenuAlt3 } from "react-icons/hi"

import Sidebar from "../components/core/Dashboard/Sidebar"
import useOnClickOutside from "../hooks/useOnClickOutside"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Open sidebar by default on desktop, closed on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const sidebarRef = useRef(null)

  // Close sidebar when clicking anywhere outside of it on small screens
  useOnClickOutside(sidebarRef, () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  })

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      {/* Mobile toggle button */}
      <button
        type="button"
        className="absolute right-4 top-4 z-30 flex items-center justify-center rounded-md border border-richblack-700 bg-richblack-800 p-2 text-richblack-5 shadow-sm outline-none md:hidden"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <HiMenuAlt3 className="text-xl" />
      </button>

      {/* Overlay for small screens - clicking anywhere closes the sidebar via useOnClickOutside */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-10 bg-richblack-900/60 md:hidden" />
      )}

      {/* Sidebar container with slide animation on small screens */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-20 w-60 transform bg-richblack-900 transition-transform duration-300 md:static md:h-[calc(100vh-3.5rem)] md:translate-x-0 md:w-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="ml-0 h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

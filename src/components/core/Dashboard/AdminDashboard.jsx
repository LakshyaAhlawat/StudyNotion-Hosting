import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../../services/apiConnector"

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [adminData, setAdminData] = useState(null)
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDesc, setNewCategoryDesc] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const BASE_URL = process.env.REACT_APP_BASE_URL;
        const [res, catRes] = await Promise.all([
            apiConnector("GET", `${BASE_URL}/admin/dashboard-data`, null, { Authorization: `Bearer ${token}` }),
            apiConnector("GET", `${BASE_URL}/course/showAllCategories`)
        ])
        if (res.data.success) {
          setAdminData(res.data.data)
        }
        if (catRes.data.success) {
            setCategories(catRes.data.data)
        }
      } catch (error) {
        console.error("Could not fetch Admin Data", error)
      }
      setLoading(false)
    })()
  }, [token])

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName || !newCategoryDesc) {
      toast.error("All fields are required")
      return
    }
    const toastId = toast.loading("Creating Category...")
    try {
      const BASE_URL = process.env.REACT_APP_BASE_URL;
      const res = await apiConnector(
        "POST",
        `${BASE_URL}/course/createCategory`,
        { name: newCategoryName, description: newCategoryDesc },
        { Authorization: `Bearer ${token}` }
      )
      if (res.data.success) {
        toast.success("Category Created Successfully")
        setNewCategoryName("")
        setNewCategoryDesc("")
        // Refresh categories
        const catRes = await apiConnector("GET", `${BASE_URL}/course/showAllCategories`)
        if (catRes.data.success) {
          setCategories(catRes.data.data)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Could not create category")
    }
    toast.dismiss(toastId)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-3xl font-medium text-richblack-5">
          Admin Dashboard
        </h1>
        <div className="flex bg-richblack-800 p-1 rounded-full glassmorphism-dark">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === "overview" ? "bg-richblack-900 text-yellow-50 shadow-[0_0_10px_rgba(255,214,10,0.3)]" : "text-richblack-200 hover:text-richblack-5"}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === "categories" ? "bg-richblack-900 text-yellow-50 shadow-[0_0_10px_rgba(255,214,10,0.3)]" : "text-richblack-200 hover:text-richblack-5"}`}
          >
            Manage Categories
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="flex flex-col gap-6 lg:flex-row animate-float" style={{animationDuration: "8s"}}>
          {/* Stats */}
          <div className="flex w-full flex-col gap-4 lg:w-[30%]">
            <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 glassmorphism-dark hover-glow">
              <p className="text-lg font-bold text-richblack-5">Total Students</p>
              <p className="text-3xl font-semibold text-yellow-50">{adminData?.totalStudents || 0}</p>
            </div>
            <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 glassmorphism-dark hover-glow">
              <p className="text-lg font-bold text-richblack-5">Total Instructors</p>
              <p className="text-3xl font-semibold text-yellow-50">{adminData?.totalInstructors || 0}</p>
            </div>
            <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 glassmorphism-dark hover-glow">
              <p className="text-lg font-bold text-richblack-5">Total Courses</p>
              <p className="text-3xl font-semibold text-yellow-50">{adminData?.totalCourses || 0}</p>
            </div>
          </div>

          {/* Latest Courses List */}
          <div className="w-full rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 lg:w-[70%] glassmorphism-dark">
            <p className="text-lg font-bold text-richblack-5 mb-4">Latest Courses</p>
            {!adminData?.latestCourses || adminData.latestCourses.length === 0 ? (
              <p className="text-richblack-300">No courses available.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {adminData.latestCourses.map((course) => (
                  <div key={course._id} className="flex flex-col md:flex-row justify-between border-b border-richblack-600 pb-4">
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-richblack-50">{course.courseName}</p>
                      <p className="text-xs text-richblack-300">By: {course.instructor?.firstName} {course.instructor?.lastName}</p>
                    </div>
                    <div className="flex flex-col md:items-end mt-2 md:mt-0">
                      <p className="text-sm text-yellow-50">₹ {course.price}</p>
                      <p className="text-xs text-richblack-300">{course.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="flex flex-col gap-6 lg:flex-row animate-[fadeIn_0.5s_ease-in-out]">
          {/* Create Category Form */}
          <div className="w-full lg:w-[40%] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 glassmorphism-dark">
            <p className="text-xl font-bold text-richblack-5 mb-6">Add New Category</p>
            <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-richblack-5">Category Name <sup className="text-pink-200">*</sup></label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="form-style w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-richblack-5">Description <sup className="text-pink-200">*</sup></label>
                <textarea
                  placeholder="Enter category description"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  className="form-style w-full min-h-[120px]"
                />
              </div>
              <button type="submit" className="yellowButton w-full mt-4">
                Create Category
              </button>
            </form>
          </div>

          {/* Existing Categories */}
          <div className="w-full lg:w-[60%] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 glassmorphism-dark">
             <p className="text-xl font-bold text-richblack-5 mb-6">Existing Categories</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat._id} className="border border-richblack-700 p-4 rounded-lg bg-richblack-900/50 hover-glow">
                    <p className="font-semibold text-yellow-50">{cat.name}</p>
                    <p className="text-sm text-richblack-300 mt-2">{cat.description}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  )
}

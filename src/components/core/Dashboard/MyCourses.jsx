// import { useEffect, useState } from "react"
// import { VscAdd } from "react-icons/vsc"
// import { useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"
// import { toast } from "react-hot-toast"

// import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
// import IconBtn from "../../Common/IconBtn"
// import CoursesTable from "./InstructorCourses/CoursesTable"

// export default function MyCourses() {
//   const { token } = useSelector((state) => state.auth)
//   const navigate = useNavigate()
//   const [courses, setCourses] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
  
//   console.log("Token in MyCourses:", token ? "Token exists" : "No token")

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true)
//         setError(null)
        
//         // ✅ Check if token exists before making API call
//         if (!token) {
//           setError("Authentication required. Please login.")
//           toast.error("Please login to view your courses.")
//           return
//         }

//         console.log("Fetching courses with token...")
//         const result = await fetchInstructorCourses(token)
        
//         if (result) {
//           setCourses(result)
//           console.log("Courses fetched successfully:", result.length)
//         } else {
//           setCourses([])
//         }
        
//       } catch (error) {
//         console.error("Error fetching courses:", error)
//         setError(error.message)
//         setCourses([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchCourses()
//   }, [token])

//   // ✅ Show loading state
//   if (loading) {
//     return (
//       <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
//         <div className="spinner"></div>
//       </div>
//     )
//   }

//   // ✅ Show error state
//   if (error) {
//     return (
//       <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
//         <div className="text-center">
//           <p className="text-2xl font-semibold text-richblack-5 mb-4">
//             Failed to load courses
//           </p>
//           <p className="text-richblack-300 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-yellow-50 text-richblack-900 px-4 py-2 rounded-md"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <div className="mb-14 flex items-center justify-between">
//         <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
//         <IconBtn
//           text="Add Course"
//           onclick={() => navigate("/dashboard/add-course")}
//         >
//           <VscAdd />
//         </IconBtn>
//       </div>
      
//       {/* ✅ Show different states based on courses array */}
//       {courses.length === 0 ? (
//         <div className="grid min-h-[50vh] place-items-center">
//           <div className="text-center">
//             <p className="text-2xl font-semibold text-richblack-5 mb-4">
//               No courses found
//             </p>
//             <p className="text-richblack-300 mb-6">
//               You haven't created any courses yet. Create your first course!
//             </p>
//             <IconBtn
//               text="Create Course"
//               onclick={() => navigate("/dashboard/add-course")}
//             >
//               <VscAdd />
//             </IconBtn>
//           </div>
//         </div>
//       ) : (
//         <CoursesTable courses={courses} setCourses={setCourses} />
//       )}
//     </div>
//   )
// }


import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../Common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
    }
    fetchCourses()
  }, [token])

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  )
}
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import Footer from "../components/Common/Footer"
import CourseCard from "../components/core/Catalog/Course_Card"
import CourseSlider from "../components/core/Catalog/Course_Slider"
import { apiConnector } from "../services/apiConnector"
import { categories } from "../services/apis"
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas"
import Error from "./Error"

function Catalog() {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  const [fetchError, setFetchError] = useState(false)

  // Fetch All Categories, find matching one
  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const allCats = res?.data?.data
        if (!allCats || allCats.length === 0) {
          setFetchError(true)
          return
        }
        const matchedCat = allCats.find(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        )
        if (!matchedCat) {
          setFetchError(true)
          return
        }
        setCategoryId(matchedCat._id)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
        setFetchError(true)
      }
    })()
  }, [catalogName])

  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          setCatalogPageData(res)
        } catch (error) {
          console.log(error)
          setFetchError(true)
        }
      })()
    }
  }, [categoryId])

  if (fetchError) return <Error />

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-300 text-sm animate-pulse">Loading catalog...</p>
        </div>
      </div>
    )
  }

  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  const selectedCourses = catalogPageData?.data?.selectedCategory?.courses || []
  const differentCourses = catalogPageData?.data?.differentCategory?.courses || []
  const mostSelling = catalogPageData?.data?.mostSellingCourses || []
  const categoryName = catalogPageData?.data?.selectedCategory?.name
  const categoryDesc = catalogPageData?.data?.selectedCategory?.description

  return (
    <div className="min-h-screen bg-richblack-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-richblack-900 via-richblack-800 to-richblack-900 border-b border-richblack-700">
        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-yellow-50/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-0 h-60 w-60 rounded-full bg-blue-400/5 blur-3xl" />

        <div className="relative mx-auto flex min-h-[280px] max-w-maxContent flex-col justify-center gap-4 px-4 py-12">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25 font-medium">{categoryName}</span>
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-richblack-5 leading-tight">
            {categoryName}
          </h1>
          <p className="max-w-[700px] text-richblack-200 text-base leading-relaxed">
            {categoryDesc}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-yellow-50/10 border border-yellow-50/20 px-4 py-1 text-sm text-yellow-25 font-medium">
              {selectedCourses.length} Course{selectedCourses.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-maxContent px-4">
        {/* Section 1 — Courses to get started */}
        <section className="py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-richblack-5">
              Courses to get you started
            </h2>
          </div>

          {/* Tab pills */}
          <div className="mb-6 flex gap-2">
            {["Most Popular", "New"].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx + 1)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  active === idx + 1
                    ? "bg-yellow-50 text-richblack-900 shadow-[0_0_12px_rgba(255,214,10,0.4)]"
                    : "bg-richblack-800 text-richblack-200 border border-richblack-700 hover:border-yellow-50/40 hover:text-richblack-5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {selectedCourses.length > 0 ? (
            <CourseSlider Courses={selectedCourses} />
          ) : (
            <div className="glassmorphism-dark rounded-xl p-10 text-center">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-richblack-200 text-lg font-semibold">No courses yet in this category</p>
              <p className="text-richblack-400 text-sm mt-1">Check back soon — instructors are building amazing content!</p>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-richblack-600 to-transparent" />

        {/* Section 2 — Top courses in different category */}
        {catalogPageData?.data?.differentCategory && (
          <section className="py-14">
            <h2 className="text-2xl lg:text-3xl font-bold text-richblack-5 mb-8">
              Top courses in{" "}
              <span className="text-yellow-25">{catalogPageData?.data?.differentCategory?.name}</span>
            </h2>
            {differentCourses.length > 0 ? (
              <CourseSlider Courses={differentCourses} />
            ) : (
              <div className="glassmorphism-dark rounded-xl p-8 text-center">
                <p className="text-richblack-400 text-sm">No published courses available here yet.</p>
              </div>
            )}
          </section>
        )}

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-richblack-600 to-transparent" />

        {/* Section 3 — Frequently Bought */}
        <section className="py-14">
          <h2 className="text-2xl lg:text-3xl font-bold text-richblack-5 mb-8">
            Frequently Bought
          </h2>
          {mostSelling.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {mostSelling.slice(0, 4).map((course, i) => (
                <CourseCard course={course} key={i} Height={"h-[400px]"} />
              ))}
            </div>
          ) : (
            <div className="glassmorphism-dark rounded-xl p-8 text-center">
              <p className="text-richblack-400 text-sm">No top-selling courses available yet.</p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default Catalog

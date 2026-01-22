import React, { useEffect, useState } from "react"
// Icons
import { FaRegStar, FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../Common/RatingStars"

function Course_Card({ course, Height }) {
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])
  // console.log("count............", avgReviewCount)

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="group rounded-2xl border border-richblack-700 bg-richblack-800/60 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.55)] transition-all duration-200 hover:-translate-y-1 hover:border-yellow-50/80 hover:shadow-[0_22px_55px_rgba(15,23,42,0.9)]">
          <div className="overflow-hidden rounded-xl">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full scale-[1.01] transform object-cover transition-transform duration-300 group-hover:scale-105`}
            />
          </div>
          <div className="flex flex-col gap-2 px-2 py-3">
            <p className="text-lg font-semibold text-richblack-5 line-clamp-2">
              {course?.courseName}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-richblack-300">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              {/* <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              /> */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-xs text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="mt-1 text-lg font-semibold text-richblack-5">
              Rs. {course?.price}
            </p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Course_Card

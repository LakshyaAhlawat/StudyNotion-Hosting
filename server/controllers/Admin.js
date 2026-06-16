const User = require("../models/User");
const Course = require("../models/Course");

exports.getAdminDashboardData = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ accountType: "Student" });
        const totalInstructors = await User.countDocuments({ accountType: "Instructor" });
        const totalCourses = await Course.countDocuments();
        
        // Let's get top 5 latest courses as well
        const latestCourses = await Course.find({}).sort({ createdAt: -1 }).limit(5).populate("instructor", "firstName lastName email");

        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalInstructors,
                totalCourses,
                latestCourses
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching admin dashboard data",
            error: error.message
        });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error fetching users" });
    }
}

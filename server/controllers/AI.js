const aiService = require("../services/aiService");
const Course = require("../models/Course");

exports.getCourseSummary = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        
        const summary = await aiService.summarizeCourse(course.courseDescription, course.whatYouWillLearn);
        return res.status(200).json({ success: true, data: summary });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error generating summary", error: error.message });
    }
};

exports.askAssistant = async (req, res) => {
    try {
        const { message, courseId } = req.body;
        const course = await Course.findById(courseId);
        const context = course ? `Course: ${course.courseName}\nDescription: ${course.courseDescription}` : "General Study Platform";
        
        const reply = await aiService.chatWithAssistant(message, context);
        return res.status(200).json({ success: true, data: reply });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error chatting with assistant", error: error.message });
    }
};

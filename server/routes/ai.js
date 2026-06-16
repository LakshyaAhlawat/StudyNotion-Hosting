const express = require("express");
const router = express.Router();
const { getCourseSummary, askAssistant } = require("../controllers/AI");
const { auth } = require("../middleware/auth");

router.post("/course-summary", auth, getCourseSummary);
router.post("/chat", auth, askAssistant);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getAdminDashboardData, getAllUsers } = require("../controllers/Admin");
const { auth, isAdmin } = require("../middleware/auth");

// Admin routes
router.get("/dashboard-data", auth, isAdmin, getAdminDashboardData);
router.get("/get-all-users", auth, isAdmin, getAllUsers);

module.exports = router;

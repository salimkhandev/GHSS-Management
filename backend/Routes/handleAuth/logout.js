const express = require("express");
const router = express.Router();


router.post("/", (req, res) => {
    // error handling
    if (!req.cookies) {
        return res.status(400).json({ error: "No cookies found" });
    }
    console.log("Logo   ut request received");
    res.clearCookie('adminToken', {
        httpOnly: true,  // Set to false for simplicity
        sameSite: 'None',
        secure: true,
        maxAge: 3600000 // 1 hour
    });
    res.clearCookie('teacherToken', {
        httpOnly: true,  // Set to false for simplicity
        sameSite: 'None',
        secure: true,
        maxAge: 3600000 // 1 hour
    });
    
    res.status(200).json({ message: "Logged out successfully" });
    // log
    console.log("Logout successful");
});

module.exports = router;

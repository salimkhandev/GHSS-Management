const express = require("express");
const router = express.Router();


router.post("/", (req, res) => {
    console.log("Logout request received");
    res.clearCookie('adminToken', {
        httpOnly: true,  // Set to false for simplicity
        sameSite: 'None',
        secure: true,
        maxAge: 0 // 1 hour
    });
    res.clearCookie('teacherToken', {
        httpOnly: true,  // Set to false for simplicity
        sameSite: 'None',
        secure: true,
        maxAge: 0 // 1 hour
    });
    
    res.status(200).json({ message: "Logged out successfully" });
    // log
    console.log("Logout successful");
});

module.exports = router;

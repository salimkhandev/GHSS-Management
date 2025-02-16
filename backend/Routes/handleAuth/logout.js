const express = require("express");
const router = express.Router();


router.post("/", (req, res) => {
    // error handling
    if (!req.cookies) {
        return res.status(400).json({ error: "No cookies found" });
    }
    console.log("Logout request  received ok");
    
    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: "ghss-management-backend.vercel.app", // 👈 Must match backend domain
        path: "/", // 👈 Must match the path used when setting the cookie
    });
    res.status(200).json({ message: "Logged out successfully" });

    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: "ghss-management-backend.vercel.app", // 👈 Must match backend domain
        path: "/", // 👈 Must match the path used when setting the cookie
    });
    res.status(200).json({ message: "Logged out successfully" });

    
    res.status(200).json({ message: "Logged out successfully" });
    // log
    console.log("Logout successful");
});

module.exports = router;

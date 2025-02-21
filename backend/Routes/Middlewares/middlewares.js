
const jwt = require('jsonwebtoken');

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const teacherToken = req.cookies.TeacherToken; // Access the token from the cookie
    // Access the token from theteacherToken; // Access the token from the cookie



    jwt.verify(teacherToken, 'your_jwt_secret', (err, DECODED) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.DECODED = DECODED;
        next(); // Proceed to the next middleware or route handler
    }
    )

}
function isAdminToken(req, res, next) {
    const adminToken = req.cookies.adminToken;    // Access the token from theteacherToken; // Access the token from the cookie



    jwt.verify(adminToken, 'your_jwt_secret', (err, DECODED) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.DECODED = DECODED;
        next(); // Proceed to the next middleware or route handler
    }
    )

}

function isAdmin(req, res, next) {
    if (req.DECODED && req.DECODED.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}
const extractClassAndSection = async (req, res, next) => {
    const token = req.cookies.TeacherToken;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        });

        // Attach to request object for use in routes
        req.teacherInfo = {
            class_id: decoded.class_id,
            section_id: decoded.section_id
        };

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports={authenticateToken,isAdmin,isAdminToken,extractClassAndSection}

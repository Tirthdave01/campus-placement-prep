const jwt = require('jsonwebtoken');

// Verifies the JWT token sent in the request header
function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  console.log("Auth Header:", authHeader);
  console.log("Token:", token);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
     console.log("JWT Verify Error:", err.message);

     return res.status(401).json({
      message: 'Invalid or expired token',
      error: err.message
  });
}
}

// Restricts a route to admin-only access, use after protect()
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = { protect, adminOnly };

const { validateToken } = require("../services/auth");
const User = require("../models/user");

// Protect routes - requires valid JWT in Bearer header or cookie
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Please log in.",
    });
  }

  try {
    const decoded = validateToken(token);
    const user = await User.findById(decoded._id || decoded.id).select("-password -salt");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found for this token.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};

// Optional auth - attaches user if valid token exists, but doesn't block if absent
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = validateToken(token);
      const user = await User.findById(decoded._id || decoded.id).select("-password -salt");
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Ignore invalid token for optional routes
    }
  }
  next();
};

// Legacy backward-compatibility helper
function checkForAuthenticationCookie(cookieName = "token") {
  return async (req, res, next) => {
    const token = req.cookies?.[cookieName];
    if (token) {
      try {
        const decoded = validateToken(token);
        const user = await User.findById(decoded._id || decoded.id).select("-password -salt");
        if (user) req.user = user;
      } catch (err) {}
    }
    next();
  };
}

module.exports = {
  protect,
  optionalAuth,
  checkForAuthenticationCookie,
};
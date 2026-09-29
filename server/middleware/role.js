// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in first.",
      });
    }

    const userRole = (req.user.role || "user").toLowerCase();
    const normalizedRoles = roles.map((r) => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${userRole}' is not permitted to perform this action.`,
      });
    }

    next();
  };
};

const isAdmin = authorize("admin");

module.exports = {
  authorize,
  isAdmin,
};

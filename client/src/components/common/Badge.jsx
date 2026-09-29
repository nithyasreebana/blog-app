import React from "react";

export const Badge = ({ children, variant = "default", className = "" }) => {
  const variantClass = {
    default: "badge",
    primary: "badge badge-primary",
    admin: "badge badge-admin",
    green: "badge badge-green",
  }[variant] || "badge";

  return <span className={`${variantClass} ${className}`}>{children}</span>;
};

export default Badge;

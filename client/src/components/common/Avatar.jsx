import React from "react";

export const Avatar = ({ src, alt = "Avatar", size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "avatar-sm",
    md: "",
    lg: "avatar-lg",
    xl: "avatar-xl",
  };

  const defaultAvatar = "/images/image.png";
  const imageSrc = src
    ? src.startsWith("http") || src.startsWith("/")
      ? src
      : `/${src}`
    : defaultAvatar;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`avatar-img ${sizeClasses[size] || ""} ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = defaultAvatar;
      }}
    />
  );
};

export default Avatar;

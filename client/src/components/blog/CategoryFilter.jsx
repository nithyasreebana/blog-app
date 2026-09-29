import React from "react";

export const CategoryFilter = ({ categories = [], activeCategory = "all", onSelectCategory }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        overflowX: "auto",
        paddingBottom: "8px",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <button
        type="button"
        onClick={() => onSelectCategory("all")}
        className={`btn btn-sm ${activeCategory === "all" ? "btn-primary" : "btn-secondary"}`}
        style={{ borderRadius: "var(--radius-full)", whiteSpace: "nowrap" }}
      >
        All Stories
      </button>

      {categories.map((cat) => {
        const isActive = activeCategory === cat._id || activeCategory === cat.slug;
        return (
          <button
            key={cat._id}
            type="button"
            onClick={() => onSelectCategory(cat._id)}
            className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)", whiteSpace: "nowrap" }}
          >
            {cat.name}
            {cat.postCount !== undefined && (
              <span
                style={{
                  marginLeft: "4px",
                  fontSize: "0.75rem",
                  opacity: 0.8,
                  padding: "1px 6px",
                  borderRadius: "10px",
                  backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                }}
              >
                {cat.postCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

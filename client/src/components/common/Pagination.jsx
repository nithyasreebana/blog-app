import React from "react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination" aria-label="Pagination Navigation">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹ Prev
      </button>

      {pages.map((p) => {
        // Show current, first, last, and immediate neighbors
        if (
          p === 1 ||
          p === totalPages ||
          (p >= currentPage - 1 && p <= currentPage + 1)
        ) {
          return (
            <button
              key={p}
              className={`pagination-btn ${currentPage === p ? "active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          );
        } else if (p === currentPage - 2 || p === currentPage + 2) {
          return (
            <span key={p} style={{ padding: "0 4px", color: "var(--text-muted)" }}>
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next ›
      </button>
    </div>
  );
};

export default Pagination;

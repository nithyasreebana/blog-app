import React, { useState } from "react";

export const SearchBar = ({ onSearch, initialValue = "", placeholder = "Search stories by title, content, or tags..." }) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: "relative", width: "100%", maxWidth: "560px" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: "absolute", left: "14px", pointerEvents: "none" }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="form-input"
          style={{
            paddingLeft: "42px",
            paddingRight: query ? "80px" : "14px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--bg-surface)",
            height: "44px",
          }}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: "absolute",
              right: "48px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            ✕
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{
            position: "absolute",
            right: "4px",
            borderRadius: "var(--radius-full)",
            height: "36px",
            padding: "0 14px",
          }}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

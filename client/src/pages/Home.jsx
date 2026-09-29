import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import SearchBar from "../components/blog/SearchBar";
import CategoryFilter from "../components/blog/CategoryFilter";
import PostList from "../components/blog/PostList";
import Pagination from "../components/common/Pagination";
import Alert from "../components/common/Alert";

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page"), 10) || 1;

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        if (res.data?.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch posts when filters or page change
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      // Sync URL query parameters
      const params = {};
      if (activeCategory !== "all") params.category = activeCategory;
      if (searchQuery) params.search = searchQuery;
      if (currentPage > 1) params.page = currentPage;
      setSearchParams(params, { replace: true });

      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: 9,
        });

        if (activeCategory !== "all") queryParams.append("category", activeCategory);
        if (searchQuery) queryParams.append("search", searchQuery);

        const res = await API.get(`/blogs?${queryParams.toString()}`);
        if (res.data?.success) {
          setPosts(res.data.data);
          setTotalPages(res.data.pagination.totalPages);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, searchQuery, currentPage]);

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="main-content">
      <div className="container">
        {/* Hero Section */}
        <section
          style={{
            textAlign: "center",
            padding: "48px 20px 40px",
            marginBottom: "36px",
            backgroundColor: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--primary)",
              backgroundColor: "var(--primary-light)",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              display: "inline-block",
              marginBottom: "12px",
            }}
          >
            Welcome to Blogify
          </span>
          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              color: "var(--text-main)",
              letterSpacing: "-0.03em",
              marginBottom: "12px",
              lineHeight: 1.2,
            }}
          >
            Discover stories, thinking, and expertise.
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              maxWidth: "600px",
              margin: "0 auto 28px",
            }}
          >
            Read thoughtful posts from our community or write and publish your own articles in seconds.
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
        </section>

        {/* Categories Bar */}
        <div style={{ marginBottom: "28px" }}>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {error && <Alert message={error} onClose={() => setError(null)} />}

        {/* Post Grid */}
        <PostList
          posts={posts}
          loading={loading}
          emptyMessage={searchQuery ? `No stories matching "${searchQuery}"` : "No stories in this category yet"}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Home;

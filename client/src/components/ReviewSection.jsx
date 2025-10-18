import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewSection({ itemId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ user: "", rating: "", comment: "" });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch reviews for this item
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${itemId}`);
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("❌ Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    if (itemId) fetchReviews();
  }, [itemId]);

  // ✅ Submit new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/reviews", {
        ...newReview,
        itemId,
      });
      alert("✅ Review added successfully!");
      setReviews([...reviews, res.data.review]);
      setNewReview({ user: "", rating: "", comment: "" });
    } catch (error) {
      alert("❌ Failed to add review. Check backend connection.");
      console.error(error);
    }
  };

  if (loading) return <p>⏳ Loading reviews...</p>;

  return (
    <div style={{ padding: "20px", background: "#f9f9f9", borderRadius: "10px", marginTop: "20px" }}>
      <h2>⭐ Customer Reviews</h2>

      {/* Existing Reviews */}
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((r, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0",
            }}
          >
            <p style={{ fontWeight: "bold" }}>
              {r.user} - ⭐ {r.rating}
            </p>
            <p style={{ color: "#555" }}>{r.comment}</p>
          </div>
        ))
      )}

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Your Name"
          value={newReview.user}
          onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="number"
          placeholder="Rating (1–5)"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <textarea
          placeholder="Write your review..."
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}

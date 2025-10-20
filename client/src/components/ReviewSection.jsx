// client/src/components/ReviewSection.jsx
import React, { useEffect, useState } from "react";
import { addReview, getItemReviews } from "../api";

export default function ReviewSection({ itemId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getItemReviews(itemId);
        setReviews(res.reviews || []);
      } catch (err) {
        console.error("Fetch reviews failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (itemId) fetch();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) return alert("Please login to post review");

      const payload = { itemId, userId: user._id, rating: Number(newReview.rating), comment: newReview.comment };
      const token = localStorage.getItem("token") || null;
      const res = await addReview(payload, token);
      alert(res.message || "Review added");
      setReviews((p) => [res.review, ...p]);
      setNewReview({ rating: "", comment: "" });
    } catch (err) {
      console.error("Add review failed:", err);
      alert(err.message || "Failed to add review. Check backend.");
    }
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div style={{ padding: 20, background: "#f9f9f9", borderRadius: 10, marginTop: 20 }}>
      <h3>⭐ Customer Reviews</h3>
      {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((r) => (
        <div key={r._id || Math.random()} style={{ borderBottom: "1px solid #ddd", padding: "8px 0" }}>
          <p style={{ fontWeight: "bold" }}>{r.user?.name || "User"} — ⭐ {r.rating}</p>
          <p style={{ color: "#555" }}>{r.comment}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
        <input type="number" min="1" max="5" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} placeholder="Rating 1-5" required style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }} />
        <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="Write review..." required style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }} />
        <button type="submit" style={{ padding: "10px 16px", background: "#007bff", color: "white", borderRadius: 6 }}>Submit Review</button>
      </form>
    </div>
  );
}

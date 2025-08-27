"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

//productId coming from parent url 
//setRev passing review from child to parent
//allReview checking in render for separat review page 
export function Review({ productId, setRev,allReview }) {
  const { valid, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch reviews for this product
  const fetchReviews = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch reviews");
      setReviews(data.data || []);
      setRev(data.data || [])
      
      setRev && setRev(data.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Submit new review
  const submitReview = async () => {
    if (!newReview.trim() || newRating === 0 || !user) return;

    setLoading(true);

    try {
      const res = await fetch("/api/reviews/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.user_metadata?.full_name || user.email,
          rating: newRating,
          comment: newReview,
          productId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      setNewReview("");
      setNewRating(0);
      toast.success("Review submitted successfully!");

      // Refresh reviews
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!valid) {
    return (
      <p className="mt-2 text-xs text-gray-500">
        Please{" "}
        <a href="/login" className="text-blue-600 underline">
          log in
        </a>{" "}
        to leave a review.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <h1 className="text-gray-500 text-3xl py-3">Customer Reviews</h1>
      <div className="mb-4">
        {fetching ? (
          <p className="text-sm text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <>
            {reviews.slice(0,allReview ? reviews.length : 2).map((r) => (
              <div key={r.id} className="mb-2 border-b pb-2">
                <p className="text-xs font-semibold">{r.username}</p>
                <div className="flex text-yellow-400 text-sm mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < r.rating ? "text-yellow-500" : "text-gray-300"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-700">{r.comment}</p>
              </div>
            ))}

            {/* Show "See All Reviews" if more than 2 */}
            {!allReview && reviews.length> 2 && (
              <Link
                href={`/product/${productId}/reviews`}
                className="text-blue-600 text-xs underline hover:text-blue-800"
              >
                See All Reviews ({reviews.length})
              </Link>
            )}
          </>
        )}
      </div>

      {/* New review form */}
      <div>
        <div className="flex gap-1 mb-1 text-yellow-400 text-sm cursor-pointer">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              onClick={() => setNewRating(i + 1)}
              className={i < newRating ? "text-yellow-500" : "text-gray-300"}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review..."
          className="w-full border rounded p-2 text-xs mb-2 focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={submitReview}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

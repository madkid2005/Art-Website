import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { ID } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [error, setError] = useState(null);

  const Access = localStorage.getItem("accessBuyer"); // Get the authentication token from localStorage

  // Fetch product details and reviews when component mounts
  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [ID]);

  // Fetch product details
  const fetchProductDetails = () => {
    fetch(`http://127.0.0.1:8000/api/store/products/${ID}/`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setError('Unable to fetch product details.');
        setLoading(false);
      });
  };

  // Fetch product reviews
  const fetchReviews = () => {
    fetch(`http://127.0.0.1:8000/api/store/products/${ID}/reviews/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Access}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setReviews(data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setError('Unable to fetch reviews.');
      });
  };

  // Submit a new review
  const submitReview = () => {
    if (!newReview.rating || !newReview.comment) {
      alert('Please provide both a rating and a comment.');
      return;
    }

    fetch(`http://127.0.0.1:8000/api/store/products/${ID}/reviews/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to submit review.");
        }
        return res.json();
      })
      .then(data => {
        setReviews([...reviews, data]);
        setNewReview({ rating: '', comment: '' });
        alert('Review submitted successfully!');
      })
      .catch(error => {
        console.error('Error submitting review:', error);
        alert('Failed to submit the review.');
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <img src={product?.image} alt={product?.name} className="img-fluid" />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h3>{product?.name}</h3>
          <p><strong>Price:</strong> ${product?.price}</p>
          <p>{product?.description}</p>

          {/* Allow all users to leave a review */}
          <div>
            <h4>Leave a Review</h4>
            <div>
              <label>Rating: </label>
              <input
                type="number"
                min="1"
                max="5"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              />
            </div>
            <div>
              <label>Comment: </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
            </div>
            <button onClick={submitReview}>Submit Review</button>
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <div className="mt-4">
        <h4>Reviews</h4>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review">
              <strong>{review.buyer?.name}</strong>
              <p>Rating: {review.rating}</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

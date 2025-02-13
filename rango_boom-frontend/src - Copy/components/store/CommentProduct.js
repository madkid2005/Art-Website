import React, { useState } from "react";
import "./css/CommentProduct.css";

export default function CommentProduct() {
  const [comment, setComment] = useState("");

  const handleSend = () => {
    if (comment.trim() === "") return;
    alert(`نظر ارسال شد: ${comment}`);
    setComment(""); // پاک کردن فیلد پس از ارسال
  };

  return (
    <div className="comment-container">
      <h5 className="comment-title">نظرات کاربرها</h5>
      <div className="comment-box">
        <input
          type="text"
          className="comment-input"
          placeholder="نظر خود را بنویسید..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="comment-btn" onClick={handleSend}>
          <i className="bi bi-send"></i>
        </button>
      </div>
    </div>
  );
}

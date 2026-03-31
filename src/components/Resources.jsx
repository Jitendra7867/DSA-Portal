import React, { useState, useEffect } from 'react';
import { DownloadCloud, Star, MessageSquareQuote, Send, User } from 'lucide-react';

export default function Resources() {
   const [reviews, setReviews] = useState([]);

   // Form State
   const [name, setName] = useState('');
   const [rating, setRating] = useState(5);
   const [message, setMessage] = useState('');
   const [status, setStatus] = useState('');

   // Load reviews from localStorage on mount
   useEffect(() => {
      const saved = localStorage.getItem('dsa_portal_reviews');
      if (saved) {
         try {
            setReviews(JSON.parse(saved));
         } catch (e) {
            console.error("Failed to parse reviews", e);
         }
      } else {
         // Seed with a fake initial review just to show the UI
         const initial = [{
            id: 'seed-1',
            name: 'Alex Developer',
            rating: 5,
            message: 'This visualizer is absolutely incredible! Finding the execution trace alongside the actual algorithms helped me completely understand Disjoint Sets.',
            date: new Date().toLocaleDateString()
         }];
         setReviews(initial);
         localStorage.setItem('dsa_portal_reviews', JSON.stringify(initial));
      }
   }, []);

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!name.trim() || !message.trim()) {
         setStatus('Name and message are required.');
         return;
      }

      const newReview = {
         id: Date.now().toString(),
         name: name.trim(),
         rating: rating,
         message: message.trim(),
         date: new Date().toLocaleDateString()
      };

      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      localStorage.setItem('dsa_portal_reviews', JSON.stringify(updatedReviews));

      // Reset
      setName('');
      setRating(5);
      setMessage('');
      setStatus('Review submitted successfully!');

      setTimeout(() => setStatus(''), 3000);
   };

   return (
      <div className="resources-layout">

         <div className="resources-header">
            <h1 className="brand-title">Community & Resources</h1>
            <p>Download the official Algorithm Notes and leave your feedback below.</p>
         </div>

         <div className="resources-grid">
            {/* LEFT COLUMN: Download Note & Form */}
            <div className="resources-col-left">

               <div className="resource-card download-card">
                  <div className="card-icon"><DownloadCloud size={32} /></div>
                  <div>
                     <h3>Official DSA Notes PDF</h3>
                     <p>Comprehensive study material covering all algorithms visualized in this portal.</p>
                  </div>
                  {/* 
                  Requires the user to drop 'dsa_notes.pdf' into the Vite /public/ folder! 
                  The generic '/dsa_notes.pdf' href targets the root public directory.
               */}
                  <a href="https://drive.google.com/file/d/1cxvXgCtlOU37IabROJ_QzdIS2qkz_LAV/view?usp=drive_link" download="DSA_Internal_Notes.pdf" className="btn btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
                     Download PDF
                  </a>
               </div>

               <div className="resource-card review-form-card">
                  <h3><MessageSquareQuote size={20} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'text-bottom' }} /> Leave a Review</h3>
                  <p className="subtitle">Let us know how this portal helped you learn!</p>

                  <form onSubmit={handleSubmit} className="review-form">
                     <div className="form-group">
                        <label>Your Name</label>
                        <div className="input-with-icon">
                           <User size={16} />
                           <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="John Doe"
                           />
                        </div>
                     </div>

                     <div className="form-group">
                        <label>Rating</label>
                        <div className="star-selector">
                           {[1, 2, 3, 4, 5].map(num => (
                              <button
                                 key={num}
                                 type="button"
                                 className={`star-btn ${rating >= num ? 'active' : ''}`}
                                 onClick={() => setRating(num)}
                              >
                                 <Star size={24} fill={rating >= num ? "#fbbf24" : "transparent"} stroke={rating >= num ? "#fbbf24" : "#64748b"} />
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="form-group">
                        <label>Message</label>
                        <textarea
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           placeholder="What did you think of the visualizer?"
                           rows="4"
                        ></textarea>
                     </div>

                     <button type="submit" className="btn btn-primary submit-btn">
                        <Send size={18} /> Submit Review
                     </button>
                     {status && <div className={`status-msg ${status.includes('required') ? 'error' : 'success'}`}>{status}</div>}
                  </form>
               </div>
            </div>

            {/* RIGHT COLUMN: Review Wall */}
            <div className="resources-col-right">
               <div className="reviews-header">
                  <h3>Community Feedback</h3>
                  <div className="badge">{reviews.length} Reviews</div>
               </div>

               <div className="reviews-list">
                  {reviews.length === 0 ? (
                     <div className="empty-text">No reviews yet. Be the first to leave one!</div>
                  ) : (
                     reviews.map(rev => (
                        <div key={rev.id} className="review-item">
                           <div className="review-top">
                              <div className="reviewer-info">
                                 <div className="avatar">{rev.name.charAt(0).toUpperCase()}</div>
                                 <div>
                                    <h4>{rev.name}</h4>
                                    <span className="review-date">{rev.date}</span>
                                 </div>
                              </div>
                              <div className="stars-display">
                                 {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < rev.rating ? "#fbbf24" : "transparent"} stroke={i < rev.rating ? "#fbbf24" : "#475569"} />
                                 ))}
                              </div>
                           </div>
                           <p className="review-body">"{rev.message}"</p>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

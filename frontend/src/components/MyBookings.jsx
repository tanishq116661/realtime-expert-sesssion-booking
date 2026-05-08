import { useState } from 'react';
import { getBookingsByEmail } from '../services/api';

function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadBookings = async (event) => {
    event.preventDefault();
    if (!email) {
      setError('Please enter your email to load bookings.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getBookingsByEmail(email.trim());
      setBookings(data.bookings);
    } catch (err) {
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2>My Bookings</h2>
        <span>{bookings.length} result{bookings.length !== 1 ? 's' : ''}</span>
      </div>

      <form className="input-row" onSubmit={loadBookings}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={!email}>
          {loading ? 'Loading…' : 'Load bookings'}
        </button>
      </form>

      {error && <div className="alert error">{error}</div>}
      {!loading && !error && bookings.length === 0 && email && <div className="empty-state">No bookings found for this email.</div>}

      {!loading && bookings.length > 0 && (
        <div className="grid cards-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="expert-card booking-card">
              <div>
                <h3>{booking.expertName}</h3>
                <p className="meta-text">{booking.date} · {booking.timeSlot}</p>
                <p>{booking.customerName} · <span className="muted">{booking.email}</span></p>
              </div>
              <div className={`status-pill status-${booking.status.toLowerCase()}`}>
                {booking.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;

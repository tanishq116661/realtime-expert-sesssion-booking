import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { createBooking, getExpertById } from '../services/api';

const socketHost = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ customerName: '', email: '', phone: '', date: '', timeSlot: '' });
  const [message, setMessage] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    let socket;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getExpertById(id);
        setExpert(data.expert);
        setSlots(data.availableSlots);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();

    socket = io(socketHost);
    socket.emit('joinExpertRoom', id);
    socket.on('slotBooked', ({ expertId, date, timeSlot }) => {
      if (expertId !== id) return;
      setSlots((existing) => existing.map((group) => ({
        ...group,
        times: group.times.map((slot) => {
          if (group.date === date && slot.time === timeSlot) {
            return { ...slot, booked: true };
          }
          return slot;
        })
      })));
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const availableDates = useMemo(() => slots.map((group) => group.date), [slots]);

  const handleInput = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const selectSlot = (date, timeSlot, booked) => {
    if (booked) return;
    setForm({ ...form, date, timeSlot });
    setMessage(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    if (!form.customerName || !form.email || !form.phone || !form.date || !form.timeSlot) {
      setMessage({ type: 'error', text: 'Please fill all booking fields and select a free slot.' });
      return;
    }
    try {
      setIsBooking(true);
      await createBooking({
        expertId: id,
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        date: form.date,
        timeSlot: form.timeSlot
      });
      setMessage({ type: 'success', text: 'Booking confirmed! Check My Bookings for status.' });
      setSlots((existing) => existing.map((group) => ({
        ...group,
        times: group.times.map((slot) => {
          if (group.date === form.date && slot.time === form.timeSlot) {
            return { ...slot, booked: true };
          }
          return slot;
        })
      })));
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="section-card"><p>Loading expert details…</p></div>;
  if (error) return <div className="section-card"><div className="alert error">{error}</div></div>;
  if (!expert) return null;

  return (
    <div className="grid grid-2">
      <div className="section-card">
        <button className="secondary back-button" onClick={() => navigate(-1)}>Back</button>
        <div className="expert-header">
          <div>
            <h2>{expert.name}</h2>
            <p className="meta-text">{expert.category}</p>
          </div>
          <div className="status-pill status-confirmed">Live availability</div>
        </div>

        <p><strong>{expert.experience} years experience</strong></p>
        <p className="rating-pill">Rating {expert.rating.toFixed(1)}</p>
        <p>{expert.description || 'Expert guidance and insights available.'}</p>

        <div className="section-card nested-card">
          <div className="section-header">
            <h3>Available slots</h3>
            <span>{availableDates.length} day{availableDates.length !== 1 ? 's' : ''}</span>
          </div>
          {slots.length === 0 && <p>No slots available.</p>}
          {slots.map((group) => (
            <div key={group.date} className="slot-group">
              <h4>{group.date}</h4>
              <div className="time-options">
                {group.times.map((slot) => (
                  <button
                    key={slot.time}
                    className={`time-chip ${slot.booked ? 'booked' : ''} ${form.date === group.date && form.timeSlot === slot.time ? 'selected' : ''}`}
                    disabled={slot.booked}
                    type="button"
                    onClick={() => selectSlot(group.date, slot.time, slot.booked)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-card booking-panel">
        <h3>Book a session</h3>
        <form onSubmit={onSubmit} className="grid booking-form">
          <input placeholder="Name" value={form.customerName} onChange={handleInput('customerName')} />
          <input type="email" placeholder="Email" value={form.email} onChange={handleInput('email')} />
          <input placeholder="Phone" value={form.phone} onChange={handleInput('phone')} />
          <input type="text" placeholder="Date" value={form.date} disabled />
          <input type="text" placeholder="Time Slot" value={form.timeSlot} disabled />
          <button type="submit" disabled={isBooking}>{isBooking ? 'Booking…' : 'Confirm booking'}</button>
        </form>
        {message && <div className={`alert ${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>}
      </div>
    </div>
  );
}

export default ExpertDetail;

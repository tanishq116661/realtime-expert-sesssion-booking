const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchJson = async (url, options = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Unable to fetch data');
  }
  return data;
};

export const getExperts = (params) => {
  const query = new URLSearchParams(params).toString();
  return fetchJson(`/experts?${query}`);
};

export const getExpertById = (id) => fetchJson(`/experts/${id}`);

export const createBooking = (payload) => fetchJson('/bookings', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const getBookingsByEmail = (email) => fetchJson(`/bookings?email=${encodeURIComponent(email)}`);

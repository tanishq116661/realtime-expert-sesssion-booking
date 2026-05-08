import React, { Suspense, lazy } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

const ExpertList = lazy(() => import('./components/ExpertList'));
const ExpertDetail = lazy(() => import('./components/ExpertDetail'));
const MyBookings = lazy(() => import('./components/MyBookings'));

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Expert Session Booking</h1>
          <p>Search experts, book time slots, and track bookings in real time.</p>
        </div>
        <nav>
          <NavLink to="/" end>Experts</NavLink>
          <NavLink to="/my-bookings">My Bookings</NavLink>
        </nav>
      </header>

      <main>
        <Suspense
          fallback={
            <div className="loading-screen">
              <div className="loader" />
              <span>Loading experience…</span>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<ExpertList />} />
            <Route path="/experts/:id" element={<ExpertDetail />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;

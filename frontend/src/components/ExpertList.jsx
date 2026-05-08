import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExperts } from '../services/api';

const categories = ['All', 'Career Coaching', 'Data Science', 'Startup Mentorship'];

function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [pendingSearch, setPendingSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categoryQuery = category === 'All' ? '' : category;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(pendingSearch);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [pendingSearch]);

  const loadExperts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getExperts({ page, limit: 8, search, category: categoryQuery });
      setExperts(data.experts);
      setPages(data.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperts();
  }, [page, category, search]);

  const totalResults = useMemo(() => experts.length, [experts]);
  const skeletonCards = Array.from({ length: 6 }, (_, idx) => idx);

  return (
    <div className="section-card">
      <div className="filter-row">
        <div className="input-row">
          <label className="visually-hidden" htmlFor="search-experts">Search experts</label>
          <input
            id="search-experts"
            placeholder="Search experts by name"
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
          />
          {pendingSearch && (
            <button
              type="button"
              className="secondary clear-btn"
              onClick={() => {
                setPendingSearch('');
                setSearch('');
                setPage(1);
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="category-grid" role="tablist" aria-label="Expert categories">
          {categories.map((option) => (
            <button
              key={option}
              type="button"
              className={`filter-pill ${category === option ? 'active' : ''}`}
              onClick={() => {
                setCategory(option);
                setPage(1);
              }}
              aria-pressed={category === option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      {!error && (
        <>
          <div className="result-row">
            {loading ? <span className="subtle-text">Loading expert list…</span> : <span>{totalResults} expert{totalResults !== 1 ? 's' : ''} found</span>}
          </div>

          <div className="grid cards-grid">
            {loading
              ? skeletonCards.map((key) => (
                  <div key={key} className="expert-card skeleton">
                    <div className="skeleton-line title" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                  </div>
                ))
              : experts.length > 0
              ? experts.map((expert) => (
                  <div key={expert._id} className="expert-card">
                    <div>
                      <h2>{expert.name}</h2>
                      <p className="meta-text">{expert.category}</p>
                      <p><strong>{expert.experience} years experience</strong></p>
                      <p className="rating-pill">Rating {expert.rating.toFixed(1)}</p>
                    </div>
                    <div className="time-options">
                      <Link to={`/experts/${expert._id}`}>
                        <button>View</button>
                      </Link>
                    </div>
                  </div>
                ))
              : !loading && <div className="empty-state">No experts match your search. Try a broader filter.</div>}
          </div>

          <div className="pagination">
            <button className="secondary" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
              Previous
            </button>
            <span>Page {page} of {pages || 1}</span>
            <button className="secondary" disabled={page >= pages} onClick={() => setPage((prev) => prev + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpertList;

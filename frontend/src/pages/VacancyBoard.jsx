import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function VacancyBoard() {
  const [vacancies, setVacancies] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVacancies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/vacancies', {
        params: roleFilter ? { role: roleFilter } : {},
      });
      setVacancies(res.data);
    } catch (err) {
      setError('Failed to load vacancies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchVacancies();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vacancy Board</h1>
        <Link to="/student/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleFilterSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Filter by role, e.g. Software Engineer"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Filter
        </button>
      </form>

      {loading && <p className="text-gray-500">Loading vacancies...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && vacancies.length === 0 && (
        <p className="text-gray-500">No vacancies found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vacancies.map((vacancy) => (
          <div key={vacancy._id} className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold text-lg">{vacancy.title}</h2>
            <p className="text-gray-600 text-sm mb-1">{vacancy.company} — {vacancy.role}</p>
            <p className="text-sm text-gray-500 mb-3">
              CTC: {vacancy.ctc || 'Not specified'} | Eligibility: {vacancy.eligibility || 'Open'}
            </p>
            <Link
              to={`/student/vacancies/${vacancy._id}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VacancyBoard;

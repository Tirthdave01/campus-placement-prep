import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusColors = {
  Applied: 'bg-yellow-100 text-yellow-700',
  Shortlisted: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/me');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <Link to="/student/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && applications.length === 0 && (
        <p className="text-gray-500">You haven't applied to any vacancies yet.</p>
      )}

      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{app.vacancyId?.title || 'Vacancy removed'}</h2>
              <p className="text-sm text-gray-500">
                {app.vacancyId?.company} — {app.vacancyId?.role}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyApplications;

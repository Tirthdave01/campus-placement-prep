import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function ViewApplicants() {
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVacancies = async () => {
      const res = await api.get('/vacancies');
      setVacancies(res.data);
    };
    fetchVacancies();
  }, []);

  const fetchApplicants = async (vacancyId) => {
    setSelectedVacancy(vacancyId);
    setLoading(true);
    try {
      const res = await api.get(`/applications/vacancy/${vacancyId}`);
      setApplicants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    await api.put(`/applications/${applicationId}`, { status });
    fetchApplicants(selectedVacancy);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">View Applicants</h1>
        <Link to="/admin/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <select
        value={selectedVacancy}
        onChange={(e) => fetchApplicants(e.target.value)}
        className="border rounded px-3 py-2 mb-6 w-full max-w-md"
      >
        <option value="">Select a vacancy to view applicants</option>
        {vacancies.map((v) => (
          <option key={v._id} value={v._id}>{v.title} — {v.company}</option>
        ))}
      </select>

      {loading && <p className="text-gray-500">Loading applicants...</p>}

      {selectedVacancy && !loading && applicants.length === 0 && (
        <p className="text-gray-500">No applicants for this vacancy yet.</p>
      )}

      <div className="space-y-3">
        {applicants.map((app) => (
          <div key={app._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{app.studentId?.name}</h2>
              <p className="text-sm text-gray-500">{app.studentId?.email}</p>
              <p className="text-xs text-gray-400 mt-1">Status: {app.status}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(app._id, 'Shortlisted')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
              >
                Shortlist
              </button>
              <button
                onClick={() => updateStatus(app._id, 'Rejected')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewApplicants;

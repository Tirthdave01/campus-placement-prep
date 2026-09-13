import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function VacancyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState(null);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await api.get(`/vacancies/${id}`);
        setVacancy(res.data);
      } catch (err) {
        setMessage('Failed to load vacancy details.');
      } finally {
        setLoading(false);
      }
    };
    fetchVacancy();
  }, [id]);

  const handleApply = async () => {
    try {
      await api.post('/applications', { vacancyId: id });
      setApplied(true);
      setMessage('Application submitted successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to apply. You may have already applied.');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!vacancy) return <div className="p-6">Vacancy not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate('/student/vacancies')}
        className="text-blue-600 hover:underline text-sm mb-4"
      >
        ← Back to Vacancy Board
      </button>

      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">{vacancy.title}</h1>
        <p className="text-gray-600 mb-4">{vacancy.company} — {vacancy.role}</p>

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <p><span className="font-medium">CTC:</span> {vacancy.ctc || 'Not specified'}</p>
          <p><span className="font-medium">Eligibility:</span> {vacancy.eligibility || 'Open to all'}</p>
          <p><span className="font-medium">Deadline:</span> {vacancy.deadline ? new Date(vacancy.deadline).toLocaleDateString() : 'Not specified'}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-medium mb-1">Description</h2>
          <p className="text-gray-700 text-sm whitespace-pre-line">{vacancy.description}</p>
        </div>

        {message && (
          <p className={`text-sm mb-3 ${applied ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <button
          onClick={handleApply}
          disabled={applied}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {applied ? 'Applied' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
}

export default VacancyDetail;

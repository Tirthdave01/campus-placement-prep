import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function ManageVacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', company: '', role: '', ctc: '', eligibility: '', deadline: '', description: '',
  });
  const [message, setMessage] = useState('');

  const fetchVacancies = async () => {
    const res = await api.get('/vacancies');
    setVacancies(res.data);
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vacancies', formData);
      setMessage('Vacancy posted successfully!');
      setFormData({ title: '', company: '', role: '', ctc: '', eligibility: '', deadline: '', description: '' });
      setShowForm(false);
      fetchVacancies();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to post vacancy.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vacancy?')) return;
    await api.delete(`/vacancies/${id}`);
    fetchVacancies();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Vacancies</h1>
        <Link to="/admin/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-6"
      >
        {showForm ? 'Cancel' : '+ Post New Vacancy'}
      </button>

      {message && <p className="text-sm text-green-700 mb-4">{message}</p>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow mb-6 max-w-xl space-y-3">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title, e.g. SDE Intern" required className="w-full border rounded px-3 py-2" />
          <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" required className="w-full border rounded px-3 py-2" />
          <input name="role" value={formData.role} onChange={handleChange} placeholder="Role, e.g. Software Engineer" required className="w-full border rounded px-3 py-2" />
          <input name="ctc" value={formData.ctc} onChange={handleChange} placeholder="CTC, e.g. 6 LPA" className="w-full border rounded px-3 py-2" />
          <input name="eligibility" value={formData.eligibility} onChange={handleChange} placeholder="Eligibility, e.g. CE/IT, 7th sem" className="w-full border rounded px-3 py-2" />
          <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job description" rows={4} className="w-full border rounded px-3 py-2" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Post Vacancy
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vacancies.map((v) => (
          <div key={v._id} className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold">{v.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{v.company} — {v.role}</p>
            <button
              onClick={() => handleDelete(v._id)}
              className="text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageVacancies;

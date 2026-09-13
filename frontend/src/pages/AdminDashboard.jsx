import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel — {user?.name}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/vacancies" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="font-semibold text-lg mb-2">Manage Vacancies</h2>
          <p className="text-gray-600 text-sm">Post, edit, or remove job/internship listings.</p>
        </Link>

        <Link to="/admin/quizzes" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="font-semibold text-lg mb-2">Manage Quizzes</h2>
          <p className="text-gray-600 text-sm">Add or edit quiz questions by category.</p>
        </Link>

        <Link to="/admin/applicants" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="font-semibold text-lg mb-2">View Applicants</h2>
          <p className="text-gray-600 text-sm">Review applicants and update their status.</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;

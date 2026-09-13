import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/student/quizzes" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="font-semibold text-lg mb-2">Quizzes</h2>
          <p className="text-gray-600 text-sm">Practice aptitude, DSA, and HR quizzes.</p>
        </Link>

        <Link to="/student/vacancies" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="font-semibold text-lg mb-2">Vacancies</h2>
          <p className="text-gray-600 text-sm">Browse and apply to job/internship postings.</p>
        </Link>

        <Link to="/student/applications" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="font-semibold text-lg mb-2">My Applications</h2>
          <p className="text-gray-600 text-sm">Track the status of your applications.</p>
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;

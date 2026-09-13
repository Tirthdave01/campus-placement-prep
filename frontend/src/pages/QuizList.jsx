import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Practice Quizzes</h1>
        <Link to="/student/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading quizzes...</p>}
      {!loading && quizzes.length === 0 && (
        <p className="text-gray-500">No quizzes available yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold text-lg">{quiz.title}</h2>
            <p className="text-sm text-gray-500 mb-3">
              {quiz.category} | {quiz.timeLimit} min
            </p>
            <Link
              to={`/student/quizzes/${quiz._id}`}
              className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm inline-block hover:bg-blue-700 transition"
            >
              Start Quiz
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;

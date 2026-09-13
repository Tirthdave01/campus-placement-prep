import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const emptyQuestion = { questionText: '', options: ['', '', '', ''], correctAnswer: '' };

function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState([{ ...emptyQuestion, options: [...emptyQuestion.options] }]);
  const [message, setMessage] = useState('');

  const fetchQuizzes = async () => {
    const res = await api.get('/quizzes');
    setQuizzes(res.data);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...emptyQuestion, options: ['', '', '', ''] }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes', { title, category, timeLimit: Number(timeLimit), questions });
      setMessage('Quiz created successfully!');
      setTitle('');
      setCategory('');
      setTimeLimit(10);
      setQuestions([{ ...emptyQuestion, options: ['', '', '', ''] }]);
      setShowForm(false);
      fetchQuizzes();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create quiz.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    await api.delete(`/quizzes/${id}`);
    fetchQuizzes();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Quizzes</h1>
        <Link to="/admin/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-6"
      >
        {showForm ? 'Cancel' : '+ Create New Quiz'}
      </button>

      {message && <p className="text-sm text-green-700 mb-4">{message}</p>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow mb-6 max-w-2xl space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" required className="w-full border rounded px-3 py-2" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category, e.g. Aptitude, DSA, HR" required className="w-full border rounded px-3 py-2" />
          <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} placeholder="Time limit (minutes)" min={1} required className="w-full border rounded px-3 py-2" />

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="border rounded p-4 space-y-2 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm">Question {qIndex + 1}</p>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-600 text-xs hover:underline">
                    Remove
                  </button>
                )}
              </div>
              <input
                value={q.questionText}
                onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                placeholder="Question text"
                required
                className="w-full border rounded px-3 py-2"
              />
              {q.options.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  placeholder={`Option ${oIndex + 1}`}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              ))}
              <input
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                placeholder="Correct answer (must match one option exactly)"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="text-blue-600 text-sm hover:underline">
            + Add another question
          </button>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition block">
            Create Quiz
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold">{quiz.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{quiz.category} | {quiz.timeLimit} min</p>
            <button onClick={() => handleDelete(quiz._id)} className="text-red-600 text-sm hover:underline">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageQuizzes;

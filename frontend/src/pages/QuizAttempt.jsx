import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionText: selectedOption }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null); // seconds
  const [submitting, setSubmitting] = useState(false);

  // Fetch quiz on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await api.get(`/quizzes/${id}`);
      setQuiz(res.data);
      setTimeLeft(res.data.timeLimit * 60);
    };
    fetchQuiz();
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionText, selectedAnswer]) => ({
        questionText,
        selectedAnswer,
      }));
      const res = await api.post(`/quizzes/${id}/submit`, { answers: formattedAnswers });
      navigate(`/student/quizzes/${id}/result`, { state: { attempt: res.data } });
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  }, [answers, id, navigate, submitting]);

  // Countdown timer, auto-submits at zero
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  if (!quiz) return <div className="p-6">Loading quiz...</div>;

  const question = quiz.questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const selectOption = (option) => {
    setAnswers({ ...answers, [question.questionText]: option });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{quiz.title}</h1>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded font-mono text-sm">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl">
        <p className="text-sm text-gray-500 mb-2">
          Question {currentIndex + 1} of {quiz.questions.length}
        </p>
        <h2 className="font-medium text-lg mb-4">{question.questionText}</h2>

        <div className="space-y-2 mb-6">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => selectOption(option)}
              className={`w-full text-left border rounded px-4 py-2 transition ${
                answers[question.questionText] === option
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded border disabled:opacity-40"
          >
            Previous
          </button>

          {currentIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizAttempt;

import { useLocation, useNavigate } from 'react-router-dom';

function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const attempt = state?.attempt;

  if (!attempt) {
    return (
      <div className="p-6">
        <p>No result data found.</p>
        <button
          onClick={() => navigate('/student/quizzes')}
          className="text-blue-600 hover:underline mt-2"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-center">Quiz Result</h1>
        <p className="text-center text-4xl font-bold text-blue-600 mb-1">
          {attempt.score} / {attempt.totalQuestions}
        </p>
        <p className="text-center text-gray-500 mb-6">{percentage}% score</p>

        <h2 className="font-medium mb-3">Answer Review</h2>
        <div className="space-y-3">
          {attempt.answers.map((a, i) => (
            <div
              key={i}
              className={`p-3 rounded border ${a.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            >
              <p className="font-medium text-sm mb-1">{a.questionText}</p>
              <p className="text-sm">
                Your answer: <span className={a.isCorrect ? 'text-green-700' : 'text-red-700'}>{a.selectedAnswer || 'Not answered'}</span>
              </p>
              {!a.isCorrect && (
                <p className="text-sm text-gray-600">Correct answer: {a.correctAnswer}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/student/quizzes')}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  );
}

export default QuizResult;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const emptyQuestion = { questionText: '', options: ['', '', '', ''], correctAnswer: '' };

const BULK_FORMAT_EXAMPLE = `Q: What is 15% of 200?
A) 20
B) 30
C) 25
D) 35
Answer: B

Q: A train travels 60km in 1 hour. How far in 3 hours?
A) 120km
B) 180km
C) 240km
D) 160km
Answer: B`;

// Parses the pasted text block into an array of question objects
function parseBulkQuestions(text) {
  const blocks = text.trim().split(/\n\s*\n/); // split on blank lines
  const parsed = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const qLine = lines.find((l) => /^Q:/i.test(l));
    const answerLine = lines.find((l) => /^Answer:/i.test(l));
    const optionLines = lines.filter((l) => /^[A-D]\)/i.test(l));

    if (!qLine || !answerLine || optionLines.length < 2) continue; // skip malformed blocks

    const questionText = qLine.replace(/^Q:\s*/i, '').trim();
    const options = optionLines.map((l) => l.replace(/^[A-D]\)\s*/i, '').trim());
    const answerLetter = answerLine.replace(/^Answer:\s*/i, '').trim().toUpperCase();
    const answerIndex = answerLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    const correctAnswer = options[answerIndex];

    if (!correctAnswer) continue; // skip if answer letter doesn't match an option

    parsed.push({ questionText, options, correctAnswer });
  }

  return parsed;
}

function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [inputMode, setInputMode] = useState('manual'); // 'manual' or 'bulk'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState([{ ...emptyQuestion, options: [...emptyQuestion.options] }]);
  const [bulkText, setBulkText] = useState('');
  const [bulkPreview, setBulkPreview] = useState([]);
  const [bulkError, setBulkError] = useState('');
  const [message, setMessage] = useState('');

  const fetchQuizzes = async () => {
    const res = await api.get('/quizzes');
    setQuizzes(res.data);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // ----- Manual mode handlers -----
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

  // ----- Bulk mode handlers -----
  const handleParseBulk = () => {
    setBulkError('');
    const parsed = parseBulkQuestions(bulkText);
    if (parsed.length === 0) {
      setBulkError('No valid questions found. Check the format matches the example below.');
      setBulkPreview([]);
      return;
    }
    setBulkPreview(parsed);
  };

  // ----- Submit (works for both modes) -----
  const handleCreate = async (e) => {
    e.preventDefault();
    const finalQuestions = inputMode === 'bulk' ? bulkPreview : questions;

    if (finalQuestions.length === 0) {
      setMessage('Add at least one valid question before submitting.');
      return;
    }

    try {
      await api.post('/quizzes', { title, category, timeLimit: Number(timeLimit), questions: finalQuestions });
      setMessage('Quiz created successfully!');
      setTitle('');
      setCategory('');
      setTimeLimit(10);
      setQuestions([{ ...emptyQuestion, options: ['', '', '', ''] }]);
      setBulkText('');
      setBulkPreview([]);
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
    <div className="page-bg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Quizzes</h1>
        <Link to="/admin/dashboard" className="text-indigo-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary px-4 py-2 rounded-lg mb-6"
      >
        {showForm ? 'Cancel' : '+ Create New Quiz'}
      </button>

      {message && <p className="text-sm text-green-700 mb-4">{message}</p>}

      {showForm && (
        <form onSubmit={handleCreate} className="app-card p-6 mb-6 max-w-2xl space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" required className="w-full border border-gray-200 rounded-lg px-3 py-2" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category, e.g. Aptitude, DSA, HR" required className="w-full border border-gray-200 rounded-lg px-3 py-2" />
          <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} placeholder="Time limit (minutes)" min={1} required className="w-full border border-gray-200 rounded-lg px-3 py-2" />

          {/* Mode switch */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInputMode('manual')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${inputMode === 'manual' ? 'btn-primary' : 'bg-gray-100 text-gray-600'}`}
            >
              Add Manually
            </button>
            <button
              type="button"
              onClick={() => setInputMode('bulk')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${inputMode === 'bulk' ? 'btn-primary' : 'bg-gray-100 text-gray-600'}`}
            >
              Paste Questions (Bulk)
            </button>
          </div>

          {inputMode === 'manual' && (
            <>
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
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
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  />
                  {q.options.map((opt, oIndex) => (
                    <input
                      key={oIndex}
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2"
                    />
                  ))}
                  <input
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                    placeholder="Correct answer (must match one option exactly)"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  />
                </div>
              ))}
              <button type="button" onClick={addQuestion} className="text-indigo-600 text-sm hover:underline">
                + Add another question
              </button>
            </>
          )}

          {inputMode === 'bulk' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paste your questions in this format:
                </label>
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 whitespace-pre-wrap mb-2">
                  {BULK_FORMAT_EXAMPLE}
                </pre>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  rows={10}
                  placeholder="Paste your questions here..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleParseBulk}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition"
              >
                Preview Parsed Questions
              </button>

              {bulkError && <p className="text-red-600 text-sm">{bulkError}</p>}

              {bulkPreview.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-700 mb-2">
                    {bulkPreview.length} question(s) parsed successfully:
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {bulkPreview.map((q, i) => (
                      <div key={i} className="text-sm bg-white rounded p-2 border border-gray-100">
                        <p className="font-medium">{i + 1}. {q.questionText}</p>
                        <p className="text-gray-500 text-xs">Options: {q.options.join(', ')}</p>
                        <p className="text-green-700 text-xs">Correct: {q.correctAnswer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button type="submit" className="btn-primary px-4 py-2 rounded-lg block">
            Create Quiz
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="app-card p-5">
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

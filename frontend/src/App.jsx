import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VacancyBoard from './pages/VacancyBoard';
import VacancyDetail from './pages/VacancyDetail';
import QuizList from './pages/QuizList';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';
import ManageVacancies from './pages/ManageVacancies';
import ManageQuizzes from './pages/ManageQuizzes';
import MyApplications from './pages/MyApplications';
import ViewApplicants from './pages/ViewApplicants';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/vacancies"
            element={
              <ProtectedRoute requiredRole="student">
                <VacancyBoard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/vacancies/:id"
            element={
              <ProtectedRoute requiredRole="student">
                <VacancyDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/quizzes"
            element={
              <ProtectedRoute requiredRole="student">
                <QuizList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/quizzes/:id"
            element={
              <ProtectedRoute requiredRole="student">
                <QuizAttempt />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/quizzes/:id/result"
            element={
              <ProtectedRoute requiredRole="student">
                <QuizResult />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vacancies"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageVacancies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/quizzes"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute requiredRole="student">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/applicants"
            element={
              <ProtectedRoute requiredRole="admin">
                <ViewApplicants />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

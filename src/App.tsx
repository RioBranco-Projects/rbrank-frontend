import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PlatformStatus } from './components/PlatformStatus';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { StudentRegister } from './pages/StudentRegister';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherLogin } from './pages/TeacherLogin';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { ProblemsPage } from './pages/ProblemsPage';
import { RankingPage } from './pages/RankingPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PlatformStatus>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cadastro-aluno" element={<StudentRegister />} />
                <Route path="/aluno/:ra" element={<StudentDashboard />} />
                <Route path="/login-professor" element={<TeacherLogin />} />
                <Route path="/professor/dashboard" element={<TeacherDashboard />} />
                <Route path="/problemas" element={<ProblemsPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </PlatformStatus>
    </AuthProvider>
  );
}

export default App;


// App.tsx - UPDATE
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import Header from '@/components/Layout/Header';

// Lazy load pages
const Home = React.lazy(() => import('@/pages/Home'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Orders = React.lazy(() => import('@/pages/Orders'));
const Schedules = React.lazy(() => import('@/pages/Schedules'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const AIDashboard = React.lazy(() => import('@/pages/AIDashboard')); // NEW

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <React.Suspense fallback={
            <div className="loading-screen">
              <div className="spinner"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/mine" element={<Register type="mine" />} />
              <Route path="/register/shipping" element={<Register type="shipping" />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* AI Dashboard untuk kedua role */}
              <Route path="/ai-dashboard" element={
                <ProtectedRoute allowedRoles={['mine_planner', 'shipping_planner']}>
                  <AIDashboard />
                </ProtectedRoute>
              } />
              
              {/* Orders bisa diakses oleh kedua role */}
              <Route path="/orders" element={
                <ProtectedRoute allowedRoles={['mine_planner', 'shipping_planner']}>
                  <Orders />
                </ProtectedRoute>
              } />
              
              <Route path="/schedules" element={
                <ProtectedRoute allowedRoles={['mine_planner', 'shipping_planner']}>
                  <Schedules />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </main>
        
        <footer className="footer">
          <p>© {new Date().getFullYear()} Mining Value Chain Optimization Platform. All rights reserved.</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;

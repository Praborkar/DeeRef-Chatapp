import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AppLayout from './layout/AppLayout'
import { useAuth } from './hooks/useAuth'
import { Toaster } from "react-hot-toast"   // ⭐ Toast component added

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    )
  }

  return (
    <>
      {/* ⭐ Global Toast Provider */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/app/*"
          element={user ? <AppLayout /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/"
          element={<Navigate to={user ? "/app" : "/login"} replace />}
        />

        <Route path="*" element={<div className="p-4">404 Not Found</div>} />
      </Routes>
    </>
  )
}

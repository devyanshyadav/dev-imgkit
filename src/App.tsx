import React from 'react'
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import AuthLayout from './components/auth-cmp/auth-layout';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Layout from './components/dashboard-cmp/layout';
import { Toaster } from 'sonner'
import { ProtectedRoute } from './components/global-cmp/protected-route';
import Home from './pages/dashboard/home';
import SignUp from './pages/auth/signup';
import ForgotPassword from './pages/auth/forgot';
import ResetPassword from './pages/auth/reset-password';
import ResetSuccess from './pages/auth/reset-success';
Amplify.configure(awsExports);

const App = () => {
  return (
    <BrowserRouter>
   <Routes>
        {/* Auth routes wrapped in a common layout */}
        <Route element={<AuthLayout/>}>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/reset-success" element={<ResetSuccess />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <Layout/>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/home" element={<Home/>} />
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/home" replace />}
          />
        </Route>
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  )
}

export default App
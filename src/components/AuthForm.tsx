import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';
import { Leaf } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, isLoading, error } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Leaf className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to PlantCare' : 'Create your account'}
          </h2>
        </div>

        {isLogin ? (
          <LoginForm
            onSubmit={login}
            onToggleForm={() => setIsLogin(false)}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <RegisterForm
            onSubmit={signup}
            onToggleForm={() => setIsLogin(true)}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
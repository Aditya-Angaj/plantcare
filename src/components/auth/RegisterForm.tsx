import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onToggleForm: () => void;
  isLoading: boolean;
  error: string | null;
}

export function RegisterForm({ onSubmit, onToggleForm, isLoading, error }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(email, password);
    }
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {displayError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{displayError}</div>
        </div>
      )}

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="register-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="register-confirm-password"
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="••••••••"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Sign up'
          )}
        </button>
      </div>

      <div className="text-sm text-center">
        <button
          type="button"
          onClick={onToggleForm}
          className="font-medium text-green-600 hover:text-green-500"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
}
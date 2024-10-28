import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { PlantManager } from './components/PlantManager';
import { AuthForm } from './components/AuthForm';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return user ? <PlantManager /> : <AuthForm />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
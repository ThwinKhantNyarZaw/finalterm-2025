import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AdminRewards from './pages/AdminRewards';
import Login from './components/Login';
import { firebaseAuth } from './lib/firebaseAuth';
import { User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated via Firebase
    const user = firebaseAuth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.role === 'ADMIN');
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAdmin(user.role === 'ADMIN');
    // Also update legacy storage for backward compatibility
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  };

  const handleLogout = async () => {
    await firebaseAuth.signOut();
    setCurrentUser(null);
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if no user is logged in
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="container mx-auto p-4 py-8">
        {isAdmin ? (
          <AdminRewards currentUser={currentUser} />
        ) : (
          <Dashboard currentUser={currentUser} />
        )}
      </main>
    </div>
  );
};

export default App;
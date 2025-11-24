import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Digital Wallet for Student Points</h1>
          {currentUser && (
            <p className="mt-1 text-sm">
              Logged in as: <span className="font-semibold">{currentUser.name}</span> ({currentUser.role})
            </p>
          )}
        </div>
        {currentUser && (
          <button
            onClick={onLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
            aria-label="Logout"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
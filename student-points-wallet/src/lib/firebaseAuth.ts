/**
 * Fake Firebase Authentication Service
 * Simulates Firebase Auth with localStorage
 */

import { User } from '../types';
import { generateUID } from '../utils/helpers';

const AUTH_KEYS = {
  USERS: 'fb_users', // All registered users
  CURRENT_USER: 'fb_currentUser',
  SESSION: 'fb_session',
};

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// Simulate network delay
const delay = (ms: number = 300 + Math.random() * 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all registered users from Firebase (localStorage)
 */
const getRegisteredUsers = (): User[] => {
  const users = localStorage.getItem(AUTH_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

/**
 * Save users to localStorage
 */
const saveUsers = (users: User[]): void => {
  localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
};

/**
 * Generate a fake JWT token
 */
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      uid: userId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  );
  const signature = btoa(`fake-signature-${userId}`);
  return `${header}.${payload}.${signature}`;
};

/**
 * Firebase-style Sign Up with Email and Password
 */
export const signUp = async (
  email: string,
  password: string,
  name: string,
  role: 'STUDENT' | 'ADMIN' = 'STUDENT'
): Promise<AuthResponse> => {
  console.log('🔥 Firebase: createUserWithEmailAndPassword', { email, role });
  await delay();

  // Validate input
  if (!email || !password || !name) {
    throw {
      code: 'auth/invalid-input',
      message: 'Please fill in all fields',
    } as AuthError;
  }

  if (password.length < 6) {
    throw {
      code: 'auth/weak-password',
      message: 'Password should be at least 6 characters',
    } as AuthError;
  }

  // Check if email already exists
  const users = getRegisteredUsers();
  const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    throw {
      code: 'auth/email-already-in-use',
      message: 'This email is already registered',
    } as AuthError;
  }

  // Generate student ID
  const studentCount = users.filter((u) => u.role === 'STUDENT').length;
  const studentId = role === 'STUDENT' ? `STU${String(studentCount + 1).padStart(3, '0')}` : `ADMIN${String(users.filter(u => u.role === 'ADMIN').length + 1).padStart(3, '0')}`;

  // Create new user
  const newUser: User = {
    id: generateUID(),
    name,
    email,
    password, // In real Firebase, this would be hashed
    studentId,
    role,
    phone: '', // Can be updated later
    points: 0,
  };

  // Save to "Firebase"
  users.push(newUser);
  saveUsers(users);

  // Also add to main users collection for backward compatibility
  const dwUsers = localStorage.getItem('dw_users');
  const dwUsersList = dwUsers ? JSON.parse(dwUsers) : [];
  dwUsersList.push(newUser);
  localStorage.setItem('dw_users', JSON.stringify(dwUsersList));

  // Generate token
  const token = generateToken(newUser.id);

  // Save session
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
  localStorage.setItem(AUTH_KEYS.SESSION, token);

  console.log('✅ Firebase: User created successfully', userWithoutPassword);

  return { user: newUser, token };
};

/**
 * Firebase-style Sign In with Email and Password
 */
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  console.log('🔥 Firebase: signInWithEmailAndPassword', { email });
  await delay();

  // Validate input
  if (!email || !password) {
    throw {
      code: 'auth/invalid-input',
      message: 'Please enter email and password',
    } as AuthError;
  }

  // Check Firebase users first
  let users = getRegisteredUsers();
  
  // If no Firebase users, check legacy dw_users
  if (users.length === 0) {
    const dwUsers = localStorage.getItem('dw_users');
    if (dwUsers) {
      users = JSON.parse(dwUsers);
      // Migrate to Firebase auth storage
      saveUsers(users);
    }
  }

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw {
      code: 'auth/invalid-credentials',
      message: 'Invalid email or password',
    } as AuthError;
  }

  // Generate token
  const token = generateToken(user.id);

  // Save session
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
  localStorage.setItem(AUTH_KEYS.SESSION, token);

  console.log('✅ Firebase: Sign in successful', userWithoutPassword);

  return { user, token };
};

/**
 * Firebase-style Sign Out
 */
export const signOut = async (): Promise<void> => {
  console.log('🔥 Firebase: signOut');
  await delay(200);

  localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
  localStorage.removeItem(AUTH_KEYS.SESSION);
  localStorage.removeItem('currentUser'); // Legacy

  console.log('✅ Firebase: Signed out successfully');
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const session = localStorage.getItem(AUTH_KEYS.SESSION);
  return !!session;
};

/**
 * Firebase-style Password Reset (simulated)
 */
export const resetPassword = async (email: string): Promise<void> => {
  console.log('🔥 Firebase: sendPasswordResetEmail', { email });
  await delay();

  const users = getRegisteredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Firebase doesn't reveal if email exists for security
    console.log('⚠️ Firebase: Password reset email sent (or user not found)');
    return;
  }

  console.log('✅ Firebase: Password reset email sent to', email);
  // In real app, this would send an email
};

/**
 * Update user profile
 */
export const updateProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  console.log('🔥 Firebase: updateProfile', { userId, updates });
  await delay();

  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    throw {
      code: 'auth/user-not-found',
      message: 'User not found',
    } as AuthError;
  }

  users[index] = { ...users[index], ...updates };
  saveUsers(users);

  // Update current user session if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const { password: _, ...userWithoutPassword } = users[index];
    localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
  }

  console.log('✅ Firebase: Profile updated', users[index]);
  return users[index];
};

// Export as Firebase-style object
export const firebaseAuth = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  isAuthenticated,
  resetPassword,
  updateProfile,
};

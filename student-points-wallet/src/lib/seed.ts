/**
 * Seed sample data for the Digital Wallet MVP
 * Initializes localStorage with sample users, rewards, and transactions
 */

import { User, Reward, Transaction } from '../types';
import { generateUID } from '../utils/helpers';

const STORAGE_KEYS = {
  USERS: 'dw_users',
  REWARDS: 'dw_rewards',
  TRANSACTIONS: 'dw_transactions',
  POINT_REQUESTS: 'dw_point_requests',
  SEEDED: 'dw_seeded',
};

// Sample users: 3 students and 1 admin
// NOTE: In production, passwords should be hashed!
const sampleUsers: User[] = [
  {
    id: generateUID(),
    name: 'Alice Johnson',
    studentId: 'STU001',
    role: 'STUDENT',
    email: 'alice@student.com',
    phone: '+1234567890',
    points: 150,
    password: 'student123', // Demo password
  },
  {
    id: generateUID(),
    name: 'Bob Smith',
    studentId: 'STU002',
    role: 'STUDENT',
    email: 'bob@student.com',
    phone: '+1234567891',
    points: 200,
    password: 'student123', // Demo password
  },
  {
    id: generateUID(),
    name: 'Charlie Davis',
    studentId: 'STU003',
    role: 'STUDENT',
    email: 'charlie@student.com',
    phone: '+1234567892',
    points: 75,
    password: 'student123', // Demo password
  },
  {
    id: 'admin-001',
    name: 'Admin User',
    studentId: 'ADMIN001',
    role: 'ADMIN',
    email: 'admin@gmail.com',
    phone: '+1234567899',
    points: 0,
    password: 'admin123', // Admin default password
  },
];

// Sample rewards
const sampleRewards: Reward[] = [
  {
    id: generateUID(),
    title: 'Free Coffee Voucher',
    cost: 50,
    quantity: 20,
    description: 'Redeem for a free coffee at the campus café',
  },
  {
    id: generateUID(),
    title: 'Movie Ticket',
    cost: 100,
    quantity: 10,
    description: 'Free movie ticket at local cinema',
  },
  {
    id: generateUID(),
    title: 'Book Store Discount',
    cost: 75,
    quantity: 15,
    description: '20% discount voucher at campus bookstore',
  },
];

// Sample transactions for students
const sampleTransactions: Transaction[] = [
  {
    id: generateUID(),
    userId: sampleUsers[0].id,
    amount: 50,
    reason: 'Attended workshop on AI',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    type: 'EARN',
  },
  {
    id: generateUID(),
    userId: sampleUsers[0].id,
    amount: 100,
    reason: 'Volunteered at campus event',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    type: 'EARN',
  },
  {
    id: generateUID(),
    userId: sampleUsers[1].id,
    amount: 150,
    reason: 'Won coding competition',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    type: 'EARN',
  },
  {
    id: generateUID(),
    userId: sampleUsers[1].id,
    amount: 50,
    reason: 'Submitted project on time',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: 'EARN',
  },
  {
    id: generateUID(),
    userId: sampleUsers[2].id,
    amount: 75,
    reason: 'Participated in study group',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    type: 'EARN',
  },
];

/**
 * Initialize localStorage with sample data
 * Only runs once (checks 'dw_seeded' flag)
 */
export const seedData = (): void => {
  // Check if already seeded
  const alreadySeeded = localStorage.getItem(STORAGE_KEYS.SEEDED);
  if (alreadySeeded === 'true') {
    console.log('✅ Data already seeded, skipping...');
    return;
  }

  console.log('🌱 Seeding sample data...');

  // Seed users (both legacy dw_users and Firebase fb_users)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleUsers));
  localStorage.setItem('fb_users', JSON.stringify(sampleUsers)); // Firebase auth storage
  console.log('  ✓ Seeded', sampleUsers.length, 'users (Firebase + Legacy)');

  // Seed rewards
  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(sampleRewards));
  console.log('  ✓ Seeded', sampleRewards.length, 'rewards');

  // Seed transactions
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(sampleTransactions));
  console.log('  ✓ Seeded', sampleTransactions.length, 'transactions');

  // Mark as seeded
  localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
  console.log('✅ Seeding complete!');
};

/**
 * Clear all data and reseed (useful for development)
 */
export const resetData = (): void => {
  console.log('🔄 Resetting all data...');
  
  // Clear legacy storage
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.REWARDS);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.POINT_REQUESTS);
  localStorage.removeItem(STORAGE_KEYS.SEEDED);
  localStorage.removeItem('currentUser');
  
  // Clear Firebase auth storage
  localStorage.removeItem('fb_users');
  localStorage.removeItem('fb_currentUser');
  localStorage.removeItem('fb_session');
  
  seedData();
  console.log('✅ Reset complete! Please refresh the page.');
};

// Export sample users for login selection
export { sampleUsers };

// Make resetData available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).resetData = resetData;
}

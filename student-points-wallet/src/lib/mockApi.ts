/**
 * Mock API wrapper around localStorage
 * Simulates backend API calls with delays and console logging
 */

import { User, Reward, Transaction, PointRequest } from '../types';
import { generateUID } from '../utils/helpers';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'dw_users',
  REWARDS: 'dw_rewards',
  TRANSACTIONS: 'dw_transactions',
  POINT_REQUESTS: 'dw_point_requests',
};

// Simulate network delay
const delay = (ms: number = 300 + Math.random() * 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock API - simulates GET /users
 * Returns all users from localStorage
 */
export const getUsers = async (): Promise<User[]> => {
  console.log('🌐 GET /users — simulating network request');
  await delay();
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  const result = users ? JSON.parse(users) : [];
  console.log('✅ GET /users — response:', result);
  return result;
};

/**
 * Mock API - simulates GET /users/:id
 */
export const getUserById = async (id: string): Promise<User | null> => {
  console.log(`🌐 GET /users/${id} — simulating network request`);
  await delay();
  const users = await getUsers();
  const user = users.find((u) => u.id === id) || null;
  console.log(`✅ GET /users/${id} — response:`, user);
  return user;
};

/**
 * Mock API - simulates POST /users
 */
export const createUser = async (user: User): Promise<User> => {
  console.log('🌐 POST /users — simulating network request', user);
  await delay();
  const users = await getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // Also sync with Firebase auth storage
  const fbUsers = localStorage.getItem('fb_users');
  const fbUsersList = fbUsers ? JSON.parse(fbUsers) : [];
  fbUsersList.push(user);
  localStorage.setItem('fb_users', JSON.stringify(fbUsersList));
  
  console.log('✅ POST /users — user created:', user);
  return user;
};

/**
 * Mock API - simulates PUT /users/:id
 */
export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  console.log(`🌐 PUT /users/${id} — simulating network request`, updates);
  await delay();
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('User not found');
  users[index] = { ...users[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  console.log(`✅ PUT /users/${id} — user updated:`, users[index]);
  return users[index];
};

/**
 * Mock API - simulates GET /rewards
 */
export const getRewards = async (): Promise<Reward[]> => {
  console.log('🌐 GET /rewards — simulating network request');
  await delay();
  const rewards = localStorage.getItem(STORAGE_KEYS.REWARDS);
  const result = rewards ? JSON.parse(rewards) : [];
  console.log('✅ GET /rewards — response:', result);
  return result;
};

/**
 * Mock API - simulates POST /rewards
 */
export const createReward = async (reward: Reward): Promise<Reward> => {
  console.log('🌐 POST /rewards — simulating network request', reward);
  await delay();
  const rewards = await getRewards();
  rewards.push(reward);
  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  console.log('✅ POST /rewards — reward created:', reward);
  return reward;
};

/**
 * Mock API - simulates PUT /rewards/:id
 */
export const updateReward = async (id: string, updates: Partial<Reward>): Promise<Reward> => {
  console.log(`🌐 PUT /rewards/${id} — simulating network request`, updates);
  await delay();
  const rewards = await getRewards();
  const index = rewards.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Reward not found');
  rewards[index] = { ...rewards[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  console.log(`✅ PUT /rewards/${id} — reward updated:`, rewards[index]);
  return rewards[index];
};

/**
 * Mock API - simulates GET /transactions
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  console.log('🌐 GET /transactions — simulating network request');
  await delay();
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const result = transactions ? JSON.parse(transactions) : [];
  console.log('✅ GET /transactions — response:', result);
  return result;
};

/**
 * Mock API - simulates GET /transactions?userId=:id
 */
export const getTransactionsByUser = async (userId: string): Promise<Transaction[]> => {
  console.log(`🌐 GET /transactions?userId=${userId} — simulating network request`);
  await delay();
  const transactions = await getTransactions();
  const result = transactions.filter((t) => t.userId === userId);
  console.log(`✅ GET /transactions?userId=${userId} — response:`, result);
  return result;
};

/**
 * Mock API - simulates POST /transactions
 * Also updates user points
 */
export const createTransaction = async (
  userId: string,
  amount: number,
  reason: string
): Promise<Transaction> => {
  console.log('🌐 POST /transactions — simulating network request', {
    userId,
    amount,
    reason,
  });
  await delay();

  // Create transaction
  const transaction: Transaction = {
    id: generateUID(),
    userId,
    amount,
    reason,
    date: new Date().toISOString(),
    type: amount > 0 ? 'EARN' : 'REDEEM',
  };

  const transactions = await getTransactions();
  transactions.push(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

  // Update user points
  const user = await getUserById(userId);
  if (user) {
    await updateUser(userId, { points: user.points + amount });
  }

  console.log('✅ POST /transactions — transaction created:', transaction);
  return transaction;
};

/**
 * Mock API - simulates POST /rewards/:id/redeem
 * Decrements reward quantity and user points
 */
export const redeemReward = async (rewardId: string, userId: string): Promise<void> => {
  console.log(`🌐 POST /rewards/${rewardId}/redeem — simulating network request`, { userId });
  await delay();

  const rewards = await getRewards();
  const reward = rewards.find((r) => r.id === rewardId);
  if (!reward) throw new Error('Reward not found');
  if (reward.quantity <= 0) throw new Error('Reward out of stock');

  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  if (user.points < reward.cost) throw new Error('Insufficient points');

  // Update reward quantity
  await updateReward(rewardId, { quantity: reward.quantity - 1 });

  // Create transaction for redemption (negative amount)
  await createTransaction(userId, -reward.cost, `Redeemed: ${reward.title}`);

  console.log(`✅ POST /rewards/${rewardId}/redeem — reward redeemed successfully`);
};

/**
 * Mock API - simulates POST /auth/login
 * Authenticates user with email and password
 */
export const login = async (email: string, password: string): Promise<User> => {
  console.log('🌐 POST /auth/login — simulating network request', { email });
  await delay();

  const users = await getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Don't return password to frontend
  const { password: _, ...userWithoutPassword } = user;
  console.log('✅ POST /auth/login — login successful:', userWithoutPassword);
  return user;
};

/**
 * Mock API - simulates GET /point-requests
 */
export const getPointRequests = async (): Promise<PointRequest[]> => {
  console.log('🌐 GET /point-requests — simulating network request');
  await delay();
  const requests = localStorage.getItem(STORAGE_KEYS.POINT_REQUESTS);
  const result = requests ? JSON.parse(requests) : [];
  console.log('✅ GET /point-requests — response:', result);
  return result;
};

/**
 * Mock API - simulates GET /point-requests?userId=:id
 */
export const getPointRequestsByUser = async (userId: string): Promise<PointRequest[]> => {
  console.log(`🌐 GET /point-requests?userId=${userId} — simulating network request`);
  await delay();
  const requests = await getPointRequests();
  const result = requests.filter((r) => r.userId === userId);
  console.log(`✅ GET /point-requests?userId=${userId} — response:`, result);
  return result;
};

/**
 * Mock API - simulates POST /point-requests
 * Student creates a request for points
 */
export const createPointRequest = async (
  userId: string,
  amount: number,
  reason: string
): Promise<PointRequest> => {
  console.log('🌐 POST /point-requests — simulating network request', {
    userId,
    amount,
    reason,
  });
  await delay();

  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const request: PointRequest = {
    id: generateUID(),
    userId,
    userName: user.name,
    amount,
    reason,
    status: 'PENDING',
    requestDate: new Date().toISOString(),
  };

  const requests = await getPointRequests();
  requests.push(request);
  localStorage.setItem(STORAGE_KEYS.POINT_REQUESTS, JSON.stringify(requests));

  console.log('✅ POST /point-requests — request created:', request);
  return request;
};

/**
 * Mock API - simulates PUT /point-requests/:id/approve
 * Admin approves a point request
 */
export const approvePointRequest = async (
  requestId: string,
  adminId: string
): Promise<PointRequest> => {
  console.log(`🌐 PUT /point-requests/${requestId}/approve — simulating network request`);
  await delay();

  const requests = await getPointRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) throw new Error('Request not found');

  const request = requests[index];
  if (request.status !== 'PENDING') {
    throw new Error('Request already reviewed');
  }

  // Update request status
  requests[index] = {
    ...request,
    status: 'APPROVED',
    reviewDate: new Date().toISOString(),
    reviewedBy: adminId,
  };
  localStorage.setItem(STORAGE_KEYS.POINT_REQUESTS, JSON.stringify(requests));

  // Add points to user via transaction
  await createTransaction(request.userId, request.amount, request.reason);

  console.log(`✅ PUT /point-requests/${requestId}/approve — request approved:`, requests[index]);
  return requests[index];
};

/**
 * Mock API - simulates PUT /point-requests/:id/reject
 * Admin rejects a point request
 */
export const rejectPointRequest = async (
  requestId: string,
  adminId: string
): Promise<PointRequest> => {
  console.log(`🌐 PUT /point-requests/${requestId}/reject — simulating network request`);
  await delay();

  const requests = await getPointRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) throw new Error('Request not found');

  const request = requests[index];
  if (request.status !== 'PENDING') {
    throw new Error('Request already reviewed');
  }

  // Update request status
  requests[index] = {
    ...request,
    status: 'REJECTED',
    reviewDate: new Date().toISOString(),
    reviewedBy: adminId,
  };
  localStorage.setItem(STORAGE_KEYS.POINT_REQUESTS, JSON.stringify(requests));

  console.log(`✅ PUT /point-requests/${requestId}/reject — request rejected:`, requests[index]);
  return requests[index];
};

/**
 * Mock API - simulates DELETE /rewards/:id
 * Admin deletes a reward
 */
export const deleteReward = async (rewardId: string): Promise<void> => {
  console.log(`🌐 DELETE /rewards/${rewardId} — simulating network request`);
  await delay();

  const rewards = await getRewards();
  const filteredRewards = rewards.filter((r) => r.id !== rewardId);
  
  if (filteredRewards.length === rewards.length) {
    throw new Error('Reward not found');
  }

  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(filteredRewards));
  console.log(`✅ DELETE /rewards/${rewardId} — reward deleted`);
};

/**
 * Mock API - simulates PUT /users/:id/adjust-points
 * Admin adjusts user points (can add or subtract)
 */
export const adjustUserPoints = async (
  userId: string,
  adjustment: number,
  reason: string,
  adminId: string
): Promise<User> => {
  console.log(`🌐 PUT /users/${userId}/adjust-points — simulating network request`, {
    adjustment,
    reason,
    adminId,
  });
  await delay();

  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  // Create transaction for audit trail
  await createTransaction(userId, adjustment, `Admin adjustment: ${reason}`);

  // Update user points
  const updatedUser = await updateUser(userId, { points: user.points + adjustment });

  console.log(`✅ PUT /users/${userId}/adjust-points — points adjusted:`, updatedUser);
  return updatedUser;
};

// Export as default object for convenience
export const mockApi = {
  // User management
  getUsers,
  getUserById,
  createUser,
  updateUser,
  
  // Rewards
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  redeemReward,
  
  // Transactions
  getTransactions,
  getTransactionsByUser,
  createTransaction,
  
  // Authentication
  login,
  
  // Point Requests
  getPointRequests,
  getPointRequestsByUser,
  createPointRequest,
  approvePointRequest,
  rejectPointRequest,
  
  // Admin Functions
  adjustUserPoints,
};

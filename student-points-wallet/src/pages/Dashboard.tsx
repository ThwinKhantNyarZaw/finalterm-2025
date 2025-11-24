import React, { useEffect, useState } from 'react';
import { User, Reward, PointRequest, Transaction } from '../types';
import { mockApi } from '../lib/mockApi';
import RequestPointsModal from '../components/RequestPointsModal';
import { formatDate } from '../utils/helpers';

interface DashboardProps {
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [myRequests, setMyRequests] = useState<PointRequest[]>([]);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>(currentUser);

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rewardsData, requestsData, transactionsData, userData] = await Promise.all([
        mockApi.getRewards(),
        mockApi.getPointRequestsByUser(currentUser.id),
        mockApi.getTransactionsByUser(currentUser.id),
        mockApi.getUserById(currentUser.id),
      ]);
      setRewards(rewardsData);
      setMyRequests(requestsData);
      setMyTransactions(transactionsData);
      if (userData) setUser(userData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;

    if (user.points < reward.cost) {
      alert('Insufficient points!');
      return;
    }

    if (reward.quantity <= 0) {
      alert('This reward is out of stock!');
      return;
    }

    if (
      window.confirm(
        `Redeem "${reward.title}" for ${reward.cost} points?\nYou will have ${
          user.points - reward.cost
        } points remaining.`
      )
    ) {
      try {
        await mockApi.redeemReward(rewardId, currentUser.id);
        alert('Reward redeemed successfully!');
        loadData(); // Refresh data
      } catch (error) {
        alert('Failed to redeem: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const pendingRequests = myRequests.filter((r) => r.status === 'PENDING');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Points Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-2">My Points Balance</h2>
        <p className="text-5xl font-bold">{user.points}</p>
        <p className="text-sm mt-2 opacity-90">Points available to redeem</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Request Points
        </button>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div key={req.id} className="text-sm text-yellow-700">
                • {req.amount} points for "{req.reason}" - Submitted {formatDate(new Date(req.requestDate))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Rewards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg mb-2">{reward.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{reward.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-blue-600 font-bold text-xl">{reward.cost} pts</span>
                <span className="text-gray-500 text-sm">
                  {reward.quantity > 0 ? `${reward.quantity} available` : 'Out of stock'}
                </span>
              </div>
              <button
                onClick={() => handleRedeem(reward.id)}
                disabled={reward.quantity <= 0 || user.points < reward.cost}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reward.quantity <= 0
                  ? 'Out of Stock'
                  : user.points < reward.cost
                  ? 'Not Enough Points'
                  : 'Redeem'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Transaction History</h2>
        {myTransactions.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">No transactions yet.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(new Date(transaction.date))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'EARN'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{transaction.reason}</td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RequestPointsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={currentUser.id}
        onSuccess={loadData}
      />
    </div>
  );
};

export default Dashboard;
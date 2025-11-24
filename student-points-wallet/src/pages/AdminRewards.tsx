import React, { useEffect, useState } from 'react';
import { Reward, User } from '../types';
import { mockApi } from '../lib/mockApi';
import RewardModal from '../components/RewardModal';
import PendingRequests from '../components/PendingRequests';
import StudentPointsManagement from '../components/StudentPointsManagement';

interface AdminRewardsProps {
  currentUser: User;
}

const AdminRewards: React.FC<AdminRewardsProps> = ({ currentUser }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'students' | 'rewards'>('requests');
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const fetchedRewards = await mockApi.getRewards();
      setRewards(fetchedRewards);
    } catch (error) {
      console.error('Failed to load rewards:', error);
    }
  };

  const handleCreateReward = async (newReward: Reward) => {
    await mockApi.createReward(newReward);
    await loadRewards();
    setIsModalOpen(false);
  };

  const handleEditReward = async (updatedReward: Reward) => {
    await mockApi.updateReward(updatedReward.id, updatedReward);
    await loadRewards();
    setIsModalOpen(false);
    setEditingReward(null);
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (window.confirm('Are you sure you want to delete this reward? This action cannot be undone.')) {
      try {
        await mockApi.deleteReward(rewardId);
        await loadRewards();
        alert('Reward deleted successfully');
      } catch (error) {
        alert('Failed to delete reward: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const handleOpenEditModal = (reward: Reward) => {
    setEditingReward(reward);
    setIsModalOpen(true);
  };

  const handleRequestUpdate = () => {
    setUpdateKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 border-b-2 font-medium transition ${
              activeTab === 'requests'
                ? 'border-blue-600 text-white'
                : 'border-transparent text-white hover:text-gray-700'
            }`}
          >
            Point Requests
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 border-b-2 font-medium transition ${
              activeTab === 'students'
                ? 'border-blue-600 text-white'
                : 'border-transparent text-white hover:text-gray-700'
            }`}
          >
            Student Points
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 border-b-2 font-medium transition ${
              activeTab === 'rewards'
                ? 'border-blue-600 text-white'
                : 'border-transparent text-white hover:text-gray-700'
            }`}
          >
            Rewards Management
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'requests' && (
        <PendingRequests key={updateKey} adminId={currentUser.id} onUpdate={handleRequestUpdate} />
      )}

      {activeTab === 'students' && (
        <StudentPointsManagement currentUser={currentUser} />
      )}

      {activeTab === 'rewards' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Rewards</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => {
                setEditingReward(null);
                setIsModalOpen(true);
              }}
            >
              + Create Reward
            </button>
          </div>

          {/* Rewards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-2">{reward.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{reward.description}</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-blue-600 font-bold">{reward.cost} points</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reward.quantity > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {reward.quantity} in stock
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleOpenEditModal(reward)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg font-medium transition text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReward(reward.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {rewards.length === 0 && (
            <p className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">
              No rewards created yet. Click "Create Reward" to add one.
            </p>
          )}
        </div>
      )}

      <RewardModal
        isOpen={isModalOpen}
        reward={editingReward}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReward(null);
        }}
        onCreate={handleCreateReward}
        onUpdate={handleEditReward}
      />
    </div>
  );
};

export default AdminRewards;
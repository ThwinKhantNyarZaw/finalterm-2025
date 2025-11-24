import React from 'react';
import { Reward } from '../types';

interface RewardListProps {
  rewards: Reward[];
  onRedeem: (rewardId: string) => void;
}

const RewardList: React.FC<RewardListProps> = ({ rewards, onRedeem }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Rewards</h2>
      <ul className="space-y-4">
        {rewards.map((reward) => (
          <li key={reward.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{reward.title}</h3>
            <p className="text-gray-600">Cost: {reward.cost} points</p>
            <p className="text-gray-600">Quantity: {reward.quantity}</p>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => onRedeem(reward.id)}
              disabled={reward.quantity <= 0}
              aria-label={`Redeem ${reward.title}`}
            >
              Redeem
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RewardList;
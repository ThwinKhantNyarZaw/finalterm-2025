import React, { useState, useEffect } from 'react';
import { Reward } from '../types';

interface RewardModalProps {
  isOpen: boolean;
  reward?: Reward | null;
  onClose: () => void;
  onCreate: (reward: Reward) => void;
  onUpdate?: (reward: Reward) => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, reward, onClose, onCreate, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (reward) {
      setTitle(reward.title);
      setCost(reward.cost);
      setQuantity(reward.quantity);
      setDescription(reward.description);
    } else {
      setTitle('');
      setCost(0);
      setQuantity(0);
      setDescription('');
    }
  }, [reward]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reward && onUpdate) {
      // Editing existing reward
      const updatedReward: Reward = {
        ...reward,
        title,
        cost,
        quantity,
        description,
      };
      onUpdate(updatedReward);
    } else {
      // Creating new reward
      const newReward: Reward = {
        id: Date.now().toString(),
        title,
        cost,
        quantity,
        description,
      };
      onCreate(newReward);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">{reward ? 'Edit Reward' : 'Create New Reward'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="cost">Cost (Points)</label>
            <input
              type="number"
              id="cost"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded w-full p-2"
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-300 hover:bg-gray-400 p-2 rounded transition">Cancel</button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition">
              {reward ? 'Update Reward' : 'Create Reward'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RewardModal;
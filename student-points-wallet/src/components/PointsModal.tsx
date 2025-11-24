import React, { useState } from 'react';
import { User } from '../types';

interface PointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
}

const PointsModal: React.FC<PointsModalProps> = ({ isOpen, onClose, student }) => {
  const [points, setPoints] = useState<number>(0);
  const [reason, setReason] = useState<string>('');

  const handleAddPoints = async () => {
    if (points > 0 && student && reason) {
      const { mockApi } = await import('../lib/mockApi');
      await mockApi.createTransaction(student.id, points, reason);
      setPoints(0);
      setReason('');
      onClose();
      window.location.reload(); // Simple refresh to update UI
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Add Points to {student.name}</h2>
        <div className="mb-4">
          <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
            Points Amount
          </label>
          <input
            id="points"
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter points (e.g., 50)"
            min="1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <input
            id="reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Attended workshop"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAddPoints}
            disabled={!points || !reason}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Points
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointsModal;
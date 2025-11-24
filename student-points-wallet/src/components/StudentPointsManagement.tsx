import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { mockApi } from '../lib/mockApi';

interface StudentPointsManagementProps {
  currentUser: User;
}

const StudentPointsManagement: React.FC<StudentPointsManagementProps> = ({ currentUser }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [adjustment, setAdjustment] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const allUsers = await mockApi.getUsers();
      const studentUsers = allUsers.filter((u) => u.role === 'STUDENT');
      setStudents(studentUsers);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student: User) => {
    setSelectedStudent(student);
    setAdjustment(0);
    setReason('');
    setShowModal(true);
  };

  const handleAdjustPoints = async () => {
    if (!selectedStudent || adjustment === 0) {
      alert('Please enter a valid adjustment amount');
      return;
    }

    if (!reason.trim()) {
      alert('Please provide a reason for the adjustment');
      return;
    }

    setProcessing(true);
    try {
      await mockApi.adjustUserPoints(selectedStudent.id, adjustment, reason, currentUser.id);
      alert(
        `Successfully ${adjustment > 0 ? 'added' : 'deducted'} ${Math.abs(adjustment)} points ${
          adjustment > 0 ? 'to' : 'from'
        } ${selectedStudent.name}`
      );
      setShowModal(false);
      setSelectedStudent(null);
      setAdjustment(0);
      setReason('');
      await loadStudents();
    } catch (error) {
      alert('Failed to adjust points: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading students...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Student Points Management</h2>
      <p className="text-gray-600 mb-6">
        View and manage student points. You can add or deduct points as needed.
      </p>

      {/* Students Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.studentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {student.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {student.points} pts
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleOpenModal(student)}
                    className="text-white hover:text-gray font-medium"
                  >
                    Adjust Points
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
          No students found in the system.
        </p>
      )}

      {/* Adjust Points Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Adjust Points</h3>
            <p className="text-gray-600 mb-4">
              Student: <span className="font-semibold">{selectedStudent.name}</span>
              <br />
              Current Balance: <span className="font-semibold">{selectedStudent.points} points</span>
            </p>

            <div className="mb-4">
              <label htmlFor="adjustment" className="block text-sm font-medium text-gray-700 mb-1">
                Points Adjustment
              </label>
              <input
                id="adjustment"
                type="number"
                value={adjustment || ''}
                onChange={(e) => setAdjustment(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount (positive to add, negative to deduct)"
              />
              <p className="text-xs text-gray-500 mt-1">
                New balance: {selectedStudent.points + adjustment} points
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason *
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Manual correction, Bonus points, Penalty"
                rows={3}
                required
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAdjustment(-50)}
                className="flex-1 px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
              >
                -50
              </button>
              <button
                onClick={() => setAdjustment(-10)}
                className="flex-1 px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
              >
                -10
              </button>
              <button
                onClick={() => setAdjustment(10)}
                className="flex-1 px-3 py-1 text-sm border border-green-300 text-green-700 rounded hover:bg-green-50"
              >
                +10
              </button>
              <button
                onClick={() => setAdjustment(50)}
                className="flex-1 px-3 py-1 text-sm border border-green-300 text-green-700 rounded hover:bg-green-50"
              >
                +50
              </button>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustPoints}
                disabled={processing || adjustment === 0 || !reason.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Apply Adjustment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPointsManagement;

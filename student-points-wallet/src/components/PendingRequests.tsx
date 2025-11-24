import React, { useEffect, useState } from 'react';
import { PointRequest } from '../types';
import { mockApi } from '../lib/mockApi';
import { formatDate } from '../utils/helpers';

interface PendingRequestsProps {
  adminId: string;
  onUpdate: () => void;
}

const PendingRequests: React.FC<PendingRequestsProps> = ({ adminId, onUpdate }) => {
  const [requests, setRequests] = useState<PointRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const allRequests = await mockApi.getPointRequests();
      setRequests(allRequests);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await mockApi.approvePointRequest(requestId, adminId);
      await loadRequests();
      onUpdate();
    } catch (error) {
      alert('Failed to approve request: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await mockApi.rejectPointRequest(requestId, adminId);
      await loadRequests();
      onUpdate();
    } catch (error) {
      alert('Failed to reject request: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const reviewedRequests = requests.filter((r) => r.status !== 'PENDING');

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Pending Requests ({pendingRequests.length})
        </h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">
            No pending requests at the moment.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{request.userName}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(new Date(request.requestDate))}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {request.amount} pts
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{request.reason}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex-1"
                  >
                    {processingId === request.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={processingId === request.id}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex-1"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed Requests */}
      {reviewedRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Recent History</h2>
          <div className="space-y-2">
            {reviewedRequests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{request.userName}</span>
                    <span className="text-gray-600"> • {request.amount} pts • </span>
                    <span className="text-gray-500">{request.reason}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;

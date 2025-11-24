import React from 'react';
import { User } from '../types';

interface StudentListProps {
  students: User[];
  onAddPoints: (student: User) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onAddPoints }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{student.studentId}</td>
              <td className="px-6 py-4 whitespace-nowrap">{student.points}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onAddPoints(student)}
                  className="text-indigo-600 hover:text-indigo-900"
                  aria-label={`Add points to ${student.name}`}
                >
                  Add Points
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
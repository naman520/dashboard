import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Team {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  member_count?: number;
}

export default function TeamManager() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        //"http://localhost:5000/api/teams",
        "https://dash-backend-vxau.onrender.com/api/teams",
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setTeams(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name.trim()) return;

    try {
      const response = await axios.post(
        //"http://localhost:5000/api/teams",
        "https://dash-backend-vxau.onrender.com/api/teams",
        newTeam,
        { withCredentials: true }
      );

      if (response.data.success) {
        setNewTeam({ name: '', description: '' });
        setShowAddForm(false);
        fetchTeams();
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setError('Failed to create team');
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (teamId === 0) {
      alert('Cannot delete admin team');
      return;
    }

    if (window.confirm('Are you sure you want to delete this team? Members will be moved to the default team.')) {
      try {
        await axios.delete(
          //`http://localhost:5000/api/teams/${teamId}`,
          `https://dash-backend-vxau.onrender.com/api/teams/${teamId}`,
          { withCredentials: true }
        );
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        setError('Failed to delete team');
      }
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Team Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {showAddForm ? 'Cancel' : 'Add Team'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleCreateTeam} className="bg-gray-100 p-4 rounded mb-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create Team
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center">Loading teams...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team) => (
                <tr key={team.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {team.description || 'No description'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(team.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {team.id !== 0 && (
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
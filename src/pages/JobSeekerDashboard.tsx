import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

type Application = {
  _id: string;
  applicantName: string;
  status: 'pending' | 'selected' | 'rejected';
  appliedDate: string;
  jobId: {
    title: string;
    company: string;
  };
};

const JobSeekerDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    axios.get('https://jobseeker-backen.onrender.com/getapplications')
      .then(res => setApplications(res.data))
      .catch(err => console.error('Failed to fetch applications', err));
  }, []);

  const chartData = [
    { week: 'Week 1', applications: 3 },
    { week: 'Week 2', applications: 6 },
    { week: 'Week 3', applications: 4 },
    { week: 'Week 4', applications: 5 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Job Seeker Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <DashboardCard label="Total Applications" value={applications.length} color="text-blue-600" />
        <DashboardCard label="Pending" value={applications.filter(app => app.status === 'pending').length} color="text-yellow-600" />
        <DashboardCard label="Selected" value={applications.filter(app => app.status === 'selected').length} color="text-green-600" />
        <DashboardCard label="Rejected" value={applications.filter(app => app.status === 'rejected').length} color="text-red-600" />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl font-semibold mb-4">Application Activity</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold mb-4">Application History</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Job Title</th>
              <th className="p-2">Company</th>
              <th className="p-2">Applied Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id} className="border-b">
                <td className="p-2">{app.jobId?.title || 'N/A'}</td>
                <td className="p-2">{app.jobId?.company || 'N/A'}</td>
                <td className="p-2">{new Date(app.appliedDate).toLocaleDateString()}</td>
                <td className="p-2 capitalize">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'selected' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-white p-6 rounded shadow">
    <h3 className="text-lg font-semibold mb-2">{label}</h3>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default JobSeekerDashboard;

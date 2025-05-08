import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// ---------------- Types ----------------
type Job = {
  _id?: string;
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  companyDescription: string;
};

type Application = {
  _id: string;
  jobId: string;
  applicantName: string;
  applicantType: string;
  currentPackage: number;
  expectedPackage: number;
  coverLetter: string;
  status: 'pending' | 'selected' | 'rejected';
  appliedDate: string;
  cv: {
    filename: string;
    path: string;
    originalname: string;
    mimetype: string;
    size: number;
  };
};

const defaultJob: Job = {
  title: '',
  company: '',
  location: '',
  category: '',
  type: '',
  salary: '',
  description: '',
  requirements: [''],
  companyDescription: ''
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const monthlyData = [
  { month: 'Jan', jobs: 4 },
  { month: 'Feb', jobs: 6 },
  { month: 'Mar', jobs: 8 },
  { month: 'Apr', jobs: 5 },
  { month: 'May', jobs: 7 },
  { month: 'Jun', jobs: 9 },
];

const EmployerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Job>(defaultJob);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchJobs = async () => {
    const res = await axios.get('http://localhost:8000/getdatajobs');
    setJobs(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get('http://localhost:8000/getapplications');
    setApplications(res.data);
  };

  const updateApplicationStatus = async (id: string, status: 'selected' | 'rejected') => {
    await axios.put(`http://localhost:8000/applications/${id}/status`, { status });
    fetchApplications();
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const openModal = (job?: Job) => {
    if (job) {
      setForm(job);
      setEditingId(job._id ?? null);
    } else {
      setForm(defaultJob);
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(defaultJob);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (i: number, value: string) => {
    const updated = [...form.requirements];
    updated[i] = value;
    setForm(prev => ({ ...prev, requirements: updated }));
  };

  const addRequirement = () => setForm(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
  const removeRequirement = (i: number) => {
    const updated = [...form.requirements];
    updated.splice(i, 1);
    setForm(prev => ({ ...prev, requirements: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:8000/updatejobs/${editingId}`, form);
    } else {
      await axios.post('http://localhost:8000/postdatajobs', form);
    }
    closeModal();
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:8000/deletejobs/${id}`);
    fetchJobs();
  };

  const pieData = Object.entries(
    jobs.reduce<Record<string, number>>((acc, job) => {
      acc[job.category] = (acc[job.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Employer Dashboard</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded shadow">Post New Job</button>
      </div>

      {/* Job Table */}
      <table className="w-full bg-white shadow rounded overflow-hidden mb-10">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job._id}>
              <td className="p-2">{job.title}</td>
              <td className="p-2">{job.category}</td>
              <td className="p-2">{job.location}</td>
              <td className="p-2">{job.type}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => openModal(job)} className="text-blue-600">Edit</button>
                <button onClick={() => job._id && handleDelete(job._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Job' : 'Post a Job'}</h2>
            <form onSubmit={handleSubmit}>
              {['title', 'company', 'location', 'category', 'type', 'salary'].map(field => (
                <div key={field} className="mb-4">
                  <label className="block mb-1 capitalize">{field}</label>
                  <input
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Company Description</label>
                <textarea
                  name="companyDescription"
                  value={form.companyDescription}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Requirements</label>
                {form.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      value={req}
                      onChange={(e) => handleRequirementChange(i, e.target.value)}
                      className="w-full border px-3 py-1 rounded"
                      required
                    />
                    {form.requirements.length > 1 && (
                      <button type="button" onClick={() => removeRequirement(i)} className="text-red-600">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addRequirement} className="text-sm text-blue-600">+ Add requirement</button>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-4">Monthly Job Postings</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobs" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-4">Jobs by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%" outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Applications Table */}
      <div className="mt-10 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Job Title</th>
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Current</th>
                <th className="p-2">Expected</th>
                <th className="p-2">Cover Letter</th>
                <th className="p-2">CV</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => {
                const job = jobs.find(j => j._id === app.jobId);
                return (
                  <tr key={app._id} className="border-b">
                    <td className="p-2">{job?.title || 'Unknown'}</td>
                    <td className="p-2">{app.applicantName}</td>
                    <td className="p-2">{app.applicantType}</td>
                    <td className="p-2">{app.currentPackage || '-'}</td>
                    <td className="p-2">{app.expectedPackage || '-'}</td>
                    <td className="p-2">{app.coverLetter || '-'}</td>
                    <td className="p-2">
                      {app.cv?.path ? (
                      <a
                      href={`http://localhost:8000/uploads/${encodeURIComponent(app.cv.filename)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Download
                    </a>
                      ) : 'No CV'}
                    </td>
                    <td className="p-2 capitalize">{app.status}</td>
                    <td className="p-2">
                      {app.status === 'pending' && (
                        <div className="space-x-2">
                          <button onClick={() => updateApplicationStatus(app._id, 'selected')} className="text-green-600">Select</button>
                          <button onClick={() => updateApplicationStatus(app._id, 'rejected')} className="text-red-600">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Building2, Clock, Send } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../store';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [applicantName, setApplicantName] = useState('');
  const [applicantType, setApplicantType] = useState('');
  const [currentPackage, setCurrentPackage] = useState('');
  const [expectedPackage, setExpectedPackage] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);

  const isDarkMode = useStore((state) => state.isDarkMode);

  useEffect(() => {
    axios
      .get(`https://jobseeker-backen.onrender.com/getdatajobs/${id}`)
      .then((response) => {
        setJob(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch job details');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('applicantName', applicantName);
    formData.append('applicantType', applicantType);
    formData.append('currentPackage', currentPackage);
    formData.append('expectedPackage', expectedPackage);
    formData.append('coverLetter', coverLetter);
    formData.append('jobId', id!);
    if (cvFile) {
      formData.append('cv', cvFile);
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('You must be logged in to apply.');
        return;
      }

      await axios.post('https://jobseeker-backen.onrender.com/applications', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          
        },
      });

      alert('Application submitted successfully!');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to submit application');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 mb-8`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex items-center text-gray-500 mb-4">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="mr-4">{job.company}</span>
              <MapPin className="w-5 h-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-4 py-2 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {job.type}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {job.category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-2">{job.salary}</div>
            <div className="flex items-center text-gray-500">
              <Clock className="w-5 h-5 mr-2" />
              <span>Posted {job.postedDate}</span>
            </div>
          </div>
        </div>

        <button
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Send className="w-5 h-5 mr-2" />
          Apply Now
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Are you a fresher or intern?</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                  value={applicantType}
                  onChange={(e) => setApplicantType(e.target.value)}
                  required
                >
                  <option value="" disabled>Select</option>
                  <option value="fresher">Fresher</option>
                  <option value="intern">Intern</option>
                  <option value="experienced">Experienced</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Current Package (LPA)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                  value={currentPackage}
                  onChange={(e) => setCurrentPackage(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Expected Package (LPA)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                  value={expectedPackage}
                  onChange={(e) => setExpectedPackage(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Cover Letter</label>
                <textarea
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Attach your CV (optional)</label>
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;

import { useState } from 'react';

type JobData = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
};

type JobUpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  jobData: JobData;
  onUpdate: (updatedJob: JobData) => void;
};

function JobUpdateModal({ isOpen, onClose, jobData, onUpdate }: JobUpdateModalProps) {
  const [title, setTitle] = useState(jobData?.title || '');
  const [description, setDescription] = useState(jobData?.description || '');
  const [category, setCategory] = useState(jobData?.category || '');
  const [location, setLocation] = useState(jobData?.location || '');

  const handleUpdate = () => {
    const updatedJob: JobData = {
      id: jobData.id,
      title,
      description,
      category,
      location,
    };
    onUpdate(updatedJob);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Update Job</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="description">Job Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobUpdateModal;

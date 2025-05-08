import React, { useState } from 'react';

// Define the Job interface
export interface Job {
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
  postedDate?: Date;
  postedBy?: string;
}

interface JobFormProps {
  job: Job | null;
  onClose: () => void;
  refreshJobs: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onClose, refreshJobs }) => {
  const [formData, setFormData] = useState<Job>({
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    category: job?.category || '',
    type: job?.type || '',
    salary: job?.salary || '',
    description: job?.description || '',
    requirements: job?.requirements || [],
    companyDescription: job?.companyDescription || '',
  });

  const handleSubmit = () => {
    // Handle form submission logic
    if (job) {
      // Update job logic (e.g., PUT request to API)
    } else {
      // Create new job logic (e.g., POST request to API)
    }
    refreshJobs(); // Refresh the job list after submit
    onClose(); // Close the modal
  };

  return (
    <div>
      <h2>{job ? 'Edit Job' : 'Post a New Job'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields for title, company, location, etc. */}
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Job Title"
        />
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Company"
        />
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Location"
        />
        {/* Add the other form fields similarly */}
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </form>
    </div>
  );
};

export default JobForm;

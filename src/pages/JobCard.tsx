import React from 'react';

interface JobCardProps {
  job: {
    title: string;
    company: string;
    location: string;
    salary: string;
    postedDate: string;
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md mx-auto mb-4 overflow-hidden">
      <h4 className="text-lg font-semibold text-gray-800 mb-1 break-words">{job.title}</h4>
      <p className="text-sm text-gray-600 break-words">{job.company}</p>
      <p className="text-sm text-gray-600 break-words">{job.location}</p>
      <p className="text-sm text-gray-700 font-medium">{job.salary}</p>
      <p className="text-xs text-gray-400 mt-2">{new Date(job.postedDate).toLocaleDateString()}</p>
    </div>
  );
};

export default JobCard;

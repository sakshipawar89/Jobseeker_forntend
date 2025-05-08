// src/pages/JobCard.tsx

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
    <div className="job-card">
      <h4>{job.title}</h4>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.salary}</p>
      <p>{new Date(job.postedDate).toLocaleDateString()}</p>
      {/* Add additional details as per your schema */}
    </div>
  );
};

export default JobCard;

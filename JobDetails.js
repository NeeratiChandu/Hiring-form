import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
const JobDetails = ({ user }) => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDoc = await firebase.firestore().collection('jobListings').doc(jobId).get();
        setJobDetails(jobDoc.data());
      } catch (error) {
        console.error('Error fetching job details:', error.message);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  return (
    <div>
      <h2>Job Details</h2>
      {jobDetails && (
        <div>
          <h3>{jobDetails.jobTitle}</h3>
          <p>{jobDetails.jobDescription}</p>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
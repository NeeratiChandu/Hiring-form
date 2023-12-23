import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
const JobApplicationForm = ({ jobId }) => {
  const [applicantName, setApplicantName] = useState('');
  const [applicantResume, setApplicantResume] = useState('');

  const applyForJob = async () => {
    try {
      await firebase.firestore().collection('jobApplications').add({
        jobId,
        applicantName,
        applicantResume,
        appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      console.log('Job application submitted successfully!');
    } catch (error) {
      console.error('Error submitting job application:', error.message);
    }
  };

  return (
    <div>
      <h2>Apply for Job</h2>
      <label>
        Your Name:
        <input type="text" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
      </label>
      <br />
      <label>
        Resume/CV Link:
        <input type="text" value={applicantResume} onChange={(e) => setApplicantResume(e.target.value)} />
      </label>
      <br />
      <button onClick={applyForJob}>Apply</button>
    </div>
  );
};

export default JobApplicationForm;
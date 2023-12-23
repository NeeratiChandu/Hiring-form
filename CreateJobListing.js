import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const CreateJobListing = ({ user }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const createJobListing = async () => {
    try {
      const jobListingRef = await firebase.firestore().collection('jobListings').add({
        jobTitle,
        jobDescription,
        createdBy: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Job Listing created with ID:', jobListingRef.id);
    } catch (error) {
      console.error('Error creating job listing:', error.message);
    }
  };

  return (
    <div>
      <h2>Create Job Listing</h2>
      <label>
        Job Title:
        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
      </label>
      <br />
      <label>
        Job Description:
        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
      </label>
      <br />
      <button onClick={createJobListing}>Create Job Listing</button>
    </div>
  );
};

export default CreateJobListing;
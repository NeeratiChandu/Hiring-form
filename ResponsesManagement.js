import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const ResponsesManagement = ({ user }) => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const responseDocs = await firebase.firestore().collection('jobApplications').where('createdBy', '==', user.uid).get();
        const responseData = responseDocs.docs.map((doc) => doc.data());
        setResponses(responseData);
      } catch (error) {
        console.error('Error fetching responses:', error.message);
      }
    };

    fetchResponses();
  }, [user.uid]);

  return (
    <div>
      <h2>Responses Management</h2>
      <ul>
        {responses.map((response) => (
          <li key={response.id}>
            <p>Applicant Name: {response.applicantName}</p>
            <p>Resume Link: {response.applicantResume}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResponsesManagement;
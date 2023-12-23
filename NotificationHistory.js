import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const NotificationHistory = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationDocs = await firebase.firestore().collection('notifications').where('userId', '==', user.uid).get();
        const notificationData = notificationDocs.docs.map((doc) => doc.data());
        setNotifications(notificationData);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    fetchNotifications();
  }, [user.uid]);

  return (
    <div>
      <h2>Notification History</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <p>Job Title: {notification.jobTitle}</p>
            <p>Applicant Name: {notification.applicantName}</p>
            <p>Timestamp: {notification.timestamp.toDate().toString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationHistory; 
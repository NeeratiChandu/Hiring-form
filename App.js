import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import Login from './components/Login';
import CreateJobListing from './components/CreateJobListing';
import JobDetails from './components/JobDetails';
import JobApplicationForm from './components/JobApplicationForm';
import ResponsesManagement from './components/ResponsesManagement';
import NotificationHistory from './components/NotificationHistory';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} user={user} /> : <Redirect to="/login" />
      }
    />
  );

  return (
    <Router>
      <Switch>
        <Route path="/login" exact>
          <Login setUser={setUser} />
        </Route>
        <PrivateRoute path="/create-job" component={CreateJobListing} />
        <PrivateRoute path="/job/:jobId" component={JobDetails} />
        <Route path="/apply/:jobId" exact>
          <JobApplicationForm />
        </Route>
        <PrivateRoute path="/responses" component={ResponsesManagement} />
        <PrivateRoute path="/notification-history" component={NotificationHistory} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
};

export default App;

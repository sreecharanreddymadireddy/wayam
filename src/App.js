import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ServiceSummaryPageComponent from './components/ServiceSummaryPageComponent';
import RegistrationFormComponent from './components/RegistrationFormComponent';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={RegistrationFormComponent} />
        <Route path="/Services" component={ServiceSummaryPageComponent} />
      </Switch>
    </Router>
  );
}

export default App;

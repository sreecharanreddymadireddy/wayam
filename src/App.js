import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ServiceSummaryPageComponent from './components/ServiceSummaryPageComponent';
import RegistrationFormComponent from './components/RegistrationFormComponent';

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/" component={RegistrationFormComponent}></Route>
        <Route path="/Services" exact component={ServiceSummaryPageComponent}></Route>
      </Switch>
    </Router>
  );
}
export default App;

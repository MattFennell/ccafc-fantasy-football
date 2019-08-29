import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import ProjectDetails from './components/projects/ProjectDetails';
// import SignIn from './components/auth/SignIn';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import CreateProject from './components/projects/CreateProject';
import AuthenticatedRoute from './auth/AuthenticatedRoute';
import Test from './test';

const App = () => (
  <BrowserRouter>
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/project/:id" component={ProjectDetails} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/create" component={CreateProject} />
        <AuthenticatedRoute path="/protected" component={Test} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
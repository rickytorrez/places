import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './places/pages/Auth';
import './App.css';

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path='/' exact component={Users} />
          <Route path='/:userId/places' exact component={UserPlaces} />
          <Route path='/places/new' exact component={NewPlace} />
          <Route path='/places/:placeId' exact component={UpdatePlace} />
          <Route path='/auth' exact component={Auth} />
          <Redirect to='/' />
        </Switch>
      </main>
    </Router>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import './styles/style.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './containers/LoginPage';
import TimelinePage from './containers/TimelinePage';
import ProfilePage from './containers/ProfilePage';
import SearchPage from './containers/SearchPage';
import AuthRoute from './containers/AuthRoute';
import headers from './services/headers';
import axios from 'axios';

function App() {
    const [loggedInUser, setLoggedInUser] = useState({});
    const user = JSON.parse(localStorage.getItem('user')) || '';
    const [authenticated, setAuthenticated] = useState(user || '');
    const user_id = user ? user.user_id : '';

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const { data } = await axios(`/api/users/${user_id}`, {
                    mode: 'cors',
                    headers: headers(),
                });
                setLoggedInUser(data);
            } catch (err) {
                console.error(err);
            }
        };
        if (user_id) {
            getUserInfo();
        }
    }, [user_id]);

    const logOut = () => {
        localStorage.removeItem('user');
        setLoggedInUser({});
        setAuthenticated(false);
    };

    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Redirect to={'/users/login'} />
                </Route>
                <Route
                    path="/users/login"
                    exact
                    render={(props) => <LoginPage {...props} authenticated={authenticated} />}
                />
                <AuthRoute
                    exact
                    path={'/users/:id/timeline'}
                    render={(props) => <TimelinePage {...props} logOut={logOut} />}
                />
                <AuthRoute
                    exact
                    path={'/users/:id/profile'}
                    render={(props) => (<ProfilePage {...props} currentUser={loggedInUser} logOut={logOut} />)}
                />
                <AuthRoute
                    path="/users/:id/search"
                    exact
                    render={(props) => (<SearchPage {...props} currentUser={loggedInUser} logOut={logOut} />)}
                />
            </Switch>
        </Router>
    );
}

export default App;

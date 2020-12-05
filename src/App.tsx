import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ForgotPassword from './components/ForgotPassword';
import Homepage from './components/HomePage';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Loader from './components/Loader';
import firebase from './firebase/config';

import {
	getUserById,
	setLoading,
	setNeedVerification,
} from './store/actions/authActions';
import { RootState } from './store';

const App: FC = () => {
	const dispatch = useDispatch();
	const { loading } = useSelector((state: RootState) => state.auth);

	// Check if user exists
	useEffect(() => {
		dispatch(setLoading(true));
		const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				dispatch(setLoading(true));
				await dispatch(getUserById(user.uid));
				if (!user.emailVerified) {
					dispatch(setNeedVerification());
				}
			}
			dispatch(setLoading(false));
		});

		return () => {
			unsubscribe();
		};
	}, [dispatch]);

	if (loading) {
		return <Loader />;
	}

	return (
		<BrowserRouter>
			<Header />
			<Switch>
				<PublicRoute path='/' component={Homepage} exact />
				<PublicRoute path='/signup' component={SignUp} exact />
				<PublicRoute path='/signin' component={SignIn} exact />
				<PublicRoute path='/forgot-password' component={ForgotPassword} exact />
				<PrivateRoute path='/dashboard' component={Dashboard} exact />
			</Switch>
		</BrowserRouter>
	);
};

export default App;

import { ThunkAction } from 'redux-thunk';
import {
	SignInData,
	SignUpData,
	AuthAction,
	SET_USER,
	User,
	SET_LOADING,
	SIGN_OUT,
	SET_SUCCESS,
	SET_ERROR,
	NEED_VERIFICATION,
} from './../types';
import { RootState } from '../index';
import firebase from '../../firebase/config';

//Create user
export const signup = (
	data: SignUpData,
	onError: () => void
): ThunkAction<void, RootState, null, AuthAction> => {
	return async (dispatch) => {
		try {
			const res = await firebase
				.auth()
				.createUserWithEmailAndPassword(data.email, data.password);
			if (res.user) {
				const userData: User = {
					email: data.email,
					firstName: data.firstName,
					id: res.user.uid,
					createdAt: Math.random() * 200,
				};
				await firebase
					.firestore()
					.collection('/users')
					.doc(res.user.uid)
					.set(userData);
				await res.user.sendEmailVerification();
				dispatch({
					type: NEED_VERIFICATION,
				});
				dispatch({
					type: SET_USER,
					payload: userData,
				});
			}
		} catch (err) {
			console.log(err);
			onError();
			dispatch({
				type: SET_ERROR,
				payload: err.message,
			});
		}
	};
};

export const getUserById = (
	id: string
): ThunkAction<void, RootState, null, AuthAction> => async (dispatch) => {
	try {
		const user = await firebase.firestore().collection('users').doc(id).get();
		if (user.exists) {
			const userData = user.data() as User;
			dispatch({
				type: SET_USER,
				payload: userData,
			});
		}
	} catch (err) {
		console.log(err);
	}
};

//set loading
export const setLoading = (
	value: boolean
): ThunkAction<void, RootState, null, AuthAction> => (dispatch) => {
	dispatch({
		type: SET_LOADING,
		payload: value,
	});
};

// login
export const signin = (
	data: SignInData,
	onError: () => void
): ThunkAction<void, RootState, null, AuthAction> => async (dispatch) => {
	try {
		await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
	} catch (error) {
		console.log(error);
		onError();
		dispatch(setError(error.message));
	}
};

//set error
export const setError = (
	msg: string
): ThunkAction<void, RootState, null, AuthAction> => (dispatch) => {
	dispatch({
		type: SET_ERROR,
		payload: msg,
	});
};

//logout
export const signOut = (): ThunkAction<
	void,
	RootState,
	null,
	AuthAction
> => async (dispatch) => {
	try {
		dispatch(setLoading(true));
		await firebase.auth().signOut();
		dispatch({
			type: SIGN_OUT,
		});
	} catch (error) {
		console.log(error);
		dispatch(setLoading(false));
	}
};

//verification
export const setNeedVerification = (): ThunkAction<
	void,
	RootState,
	null,
	AuthAction
> => (dispatch) => {
	dispatch({
		type: NEED_VERIFICATION,
	});
};

//set success
export const setSuccess = (
	msg: string
): ThunkAction<void, RootState, null, AuthAction> => (dispatch) => {
	dispatch({
		type: SET_SUCCESS,
		payload: msg,
	});
};

//reset email
export const resetEmail = (
	email: string,
	successMsg: string
): ThunkAction<void, RootState, null, AuthAction> => async (dispatch) => {
	try {
		await firebase.auth().sendPasswordResetEmail(email);
		dispatch(setSuccess(successMsg));
	} catch (error) {
		console.log(error);
		dispatch(setError(error.message));
	}
};

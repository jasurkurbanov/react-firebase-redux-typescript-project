import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default firebase.initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_api_key,
	authDomain: process.env.REACT_APP_FIREBASE_authDomain,
	databaseURL: process.env.REACT_APP_FIREBASE_databaseURL,
	projectId: process.env.REACT_APP_FIREBASE_projectId,
	storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
	messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
	appId: process.env.REACT_APP_FIREBASE_appId,
});

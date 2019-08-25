import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: 'react-crud-c462c',
};
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
export { firestore };

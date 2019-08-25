import { firestore } from '../server/firebase';
import firebase from 'firebase/app';

export const READ_EVENT = 'READ_EVENT';
export const READ_EVENTS = 'READ_EVENTS';
export const CREATE_EVENT = 'CREATE_EVENT';
export const UPDATE_EVENT = 'UPDATE_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';

const collectionName = 'posts';
const offlineErrorMessage = 'ネットワークに接続の上、アクセスしてください';

export const readEvents = () => async dispatch => {
  firestore.collection(collectionName).get()
    .then((querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push(doc.data());
      });
      return posts;
    })
    .then((data) => {
      dispatch({ type: READ_EVENTS, data })
    })
    .catch((error) => {
      console.error('ERROR', error);
    });
};

export const postEvent = values => async dispatch => {
  firebase.firestore().disableNetwork()
    .then(() => {
      alert(offlineErrorMessage);
    });
  firestore.collection(collectionName).doc((values.id).toString(10)).set(values)
    .then(() => {
      dispatch({ type: CREATE_EVENT, values })
    })
    .catch((error) => {
      console.error('ERROR', error);
    });
};

export const putEvent = values => async dispatch => {
  firebase.firestore().disableNetwork()
    .then(() => {
      alert(offlineErrorMessage);
    });
  firestore.collection(collectionName).doc((values.id).toString(10)).update(values)
    .then(() => {
      dispatch({ type: UPDATE_EVENT, values });
    })
    .catch((error) => {
      console.error('ERROR', error);
    });
}

export const getEvent = id => async dispatch => {
  firestore.collection(collectionName).doc(id).get()
    .then((doc) => {
      if (doc.exists) {
        const values = doc.data();
        dispatch({ type: READ_EVENT, values });
      }
    })
    .catch((error) => {
      console.error('ERROR', error);
    });
}

export const deleteEvent = id => async dispatch => {
  firebase.firestore().disableNetwork()
    .then(() => {
      alert(offlineErrorMessage);
    });
  firestore.collection(collectionName).doc(id).delete()
    .then(function() {
      dispatch({ type: DELETE_EVENT, id })
    })
    .catch((error) => {
      console.error('ERROR', error);
    });
};

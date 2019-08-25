import axios from 'axios';
import { firestore } from '../index';

export const READ_EVENT = 'READ_EVENT';
export const READ_EVENTS = 'READ_EVENTS';
export const CREATE_EVENT = 'CREATE_EVENT';
export const UPDATE_EVENT = 'UPDATE_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';

const ROOT_URL = 'https://udemy-utils.herokuapp.com/api/v1';
const QUERYSTRING = '?token=token123';

export const readEvents = () => async dispatch => {
  firestore.collection('posts').get()
    .then((querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push(doc.data());
      });
      return posts;
    })
    .then((data) => {
      dispatch({ type: READ_EVENTS, data })
    });
};

export const postEvent = values => async dispatch => {
  firestore.collection('posts').doc((values.id).toString(10)).set(values)
  .then(() => {
    dispatch({ type: CREATE_EVENT, values })
  })
};

export const putEvent = values => async dispatch => {
  firestore.collection('posts').doc((values.id).toString(10)).update(values)
    .then(() => {
      dispatch({ type: UPDATE_EVENT, values });
    });
}

export const getEvent = id => async dispatch => {
  firestore.collection('posts').doc(id).get()
  .then((doc) => {
    if (doc.exists) {
      const values = doc.data();
      dispatch({ type: READ_EVENT, values });
    }
  })
}

export const deleteEvent = id => async dispatch => {
  await axios.delete(`${ROOT_URL}/events/${id}${QUERYSTRING}`);
  dispatch({ type: DELETE_EVENT, id })
};

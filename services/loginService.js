const firebase = require('firebase/app');
require('firebase/auth');

const apiKey = 'AIzaSyAhfuX7z0RjMWGiQ_IyrVd81NTKOfCRnmM';

const fb = firebase.initializeApp({
  apiKey: apiKey
});

exports.addUser = (email, password) =>
  fb.auth().createUserWithEmailAndPassword(email, password);

exports.authenticate = (email, password) =>
  fb.auth().signInWithEmailAndPassword(email, password);

import axios from 'axios';
import firebase from 'firebase';
import { showAlert } from './alerts';

require('firebase/auth');

export const login = async (email, password) => {
  try {
    if (email != '' && password != '') {
      var result = firebase.auth().signInWithEmailAndPassword(email, password);
      result.catch(err => {
        var message = err.message;
        console.log(`Message: ${message}`);
        return res.end("Can't login");
      });
      res.status(200).send('Ok');
    } else {
      showAlert('Warning', 'Please fill out the form!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

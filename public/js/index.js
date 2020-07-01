//import { showAlert } from './alerts';

import login from './login';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAhfuX7z0RjMWGiQ_IyrVd81NTKOfCRnmM',
  authDomain: 'lollipopbookstore.firebaseapp.com',
  databaseURL: 'https://lollipopbookstore.firebaseio.com',
  projectId: 'lollipopbookstore',
  storageBucket: 'lollipopbookstore.appspot.com',
  messagingSenderId: '132368687138',
  appId: '1:132368687138:web:05e3703c4d175189dc2a7b',
  measurementId: 'G-7S9HSB1LDS'
};
// Initialize Firebase
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

const loginForm = document.querySelector('.form--login');
if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

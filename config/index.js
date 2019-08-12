import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBHCc4hJNPQUGBu3mup6WJCVCylUwmUyys',
  authDomain: 'dice-roller-d68fa.firebaseapp.com',
  databaseURL: 'https://dice-roller-d68fa.firebaseio.com',
  projectId: 'dice-roller-d68fa',
  storageBucket: '',
  messagingSenderId: '277235469300',
  appId: '1:277235469300:web:b3717529c807f6b9',
};

const configure = () => {
  firebase.initializeApp(config);
};

export default configure;

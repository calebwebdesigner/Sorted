import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// emptied out so it's not sitting out for everyone to see on github, will need to fill before deploying
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

// init firebase
initializeApp(firebaseConfig);

// init firebase services
const projectFirestore = getFirestore();
const projectAuth = getAuth();
const projectStorage = getStorage();

export { projectFirestore, projectAuth, projectStorage };

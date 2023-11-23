import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDlJ4wIt7iX-jOTf_ds-1QorUkCHKSVU5k",
    authDomain: "min-ia.firebaseapp.com",
    projectId: "min-ia",
    storageBucket: "min-ia.appspot.com",
    messagingSenderId: "2106354433",
    appId: "1:2106354433:web:2768eaef8090e2ab1c4900",
    measurementId: "G-Z5BBG5DYNS"
};

// Initialize Firebase
const firebaseAPP = initializeApp(firebaseConfig);

const storage = getStorage(firebaseAPP);

export { storage};


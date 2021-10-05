import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYfI9q71Q1USbPxGDn_7882cZDiOO8bic",
  authDomain: "chatting-application-92cca.firebaseapp.com",
  projectId: "chatting-application-92cca",
  storageBucket: "chatting-application-92cca.appspot.com",
  messagingSenderId: "929741493800",
  appId: "1:929741493800:web:140f5a98adff1e6453871d",
  measurementId: "G-FKKQRYVC2R"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();
const db = firebaseApp.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider} ;
export default db;
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDypc1XT58aL7VGS5VcdUIEogtLWGjWTxI',
  authDomain: 'todo-app-83da4.firebaseapp.com',
  projectId: 'todo-app-83da4',
  storageBucket: 'todo-app-83da4.firebasestorage.app',
  messagingSenderId: '9422975165',
  appId: '1:9422975165:web:635dcb29ab696b657cc7d4',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db

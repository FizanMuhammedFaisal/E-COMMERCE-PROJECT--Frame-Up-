// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCLX5KALBsex0aWHb0UmHg0M37nt6vZ-EM',
  authDomain: 'frame-up-139b4.firebaseapp.com',
  projectId: 'frame-up-139b4',
  storageBucket: 'frame-up-139b4.appspot.com',
  messagingSenderId: '255371126347',
  appId: '1:255371126347:web:9ce948775ffd04d0d04fce',
  measurementId: 'G-E8BWWP5XXN'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

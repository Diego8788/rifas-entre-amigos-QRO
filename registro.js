import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {sendEmailVerification, getAuth, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';


const firebaseConfig = {
  apiKey: "AIzaSyAhAnw24WG2FPd8lxW4nIcoXdPdi6zrak0",
  authDomain: "fb-login-9e344.firebaseapp.com",
  projectId: "fb-login-9e344",
  storageBucket: "fb-login-9e344.appspot.com",
  messagingSenderId: "587442616165",
  appId: "1:587442616165:web:53e57a07d0457196a6538c",
  measurementId: "G-H5HQGZSWFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

registro.addEventListener('click', (e) => {
  var email = document.getElementById('emailreg').value;
  var password = document.getElementById('passwordreg').value;

  createUserWithEmailAndPassword(auth, email, password).then(cred => {
    alert("Usuario creado");
    auth.signOut();
    sendEmailVerification(auth.currentUser).then(() => {
      alert('Se ha enviado un correo de verificación');
    });
  }).catch(error => {
    const errorCode = error.code;

    if (errorCode == 'auth/email-already-in-use')
      alert('El correo ya esta en uso');
    else if (errorCode == 'auth/invalid-email')
      alert('El correo no es valido');
    else if (errorCode == 'auth/weak-password')
      alert('La contraseña debe tener al menos 6 carateres');
  });
});
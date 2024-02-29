import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { sendEmailVerification, getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

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

// Obtén referencias a tus elementos del DOM aquí...

login.addEventListener('click', (e) => {
  var email = document.getElementById('emaillog').value;
  var password = document.getElementById('passwordlog').value;

  signInWithEmailAndPassword(auth, email, password).then(cred => {
    localStorage.setItem('usuarioAutenticado', 'true'); 
    alert("Usuario logueado");
    console.log(cred.user);

    // Redirigir a la página panel.html después de iniciar sesión
    window.location.href = "panel.html";
  }).catch(error => {
    const errorCode = error.code;

    if (errorCode == 'auth/invalid-email')
      alert('El correo no es valido');
    else if (errorCode == 'auth/user-disabled')
      alert('El usuario a sido deshabilitado');
    else if (errorCode == 'auth/user-not-found')
      alert('El usuario no existe');
    else if (errorCode == 'auth/wrong-password')
      alert('La contraseña es incorrecta');
  });
});

cerrar.addEventListener('click', (e) => {
  auth.signOut().then(() => {
    localStorage.removeItem('usuarioAutenticado'); 
    window.location.href = "index.html";
  }).catch((error) => {
    alert('Error al cerrar sesion');
  });
});

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Usuario Activo");
    if (!user.emailVerified) {
      // Si el correo electrónico no está verificado, cierra la sesión
      auth.signOut();
    }
  } else {
    console.log("Usuario Inactivo");
  }
});

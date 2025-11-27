// Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyCTHj4MR69eav01_AUH_w6dqAy3RdLFh5I",
    authDomain: "game-63636.firebaseapp.com",
    databaseURL: "https://game-63636-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "game-63636",
    storageBucket: "game-63636.firebasestorage.app",
    messagingSenderId: "1080266407882",
    appId: "1:1080266407882:web:ecac185d60a5aa9785d933",
    measurementId: "G-GSP1KJBWX2"
};

// Firebase initialisieren
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    window.db = firebase.database();
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}
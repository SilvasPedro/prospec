// Importando via CDN para funcionar direto no navegador
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdYMZA6viekwyMns0Z_uT0UUIw-imH6Hk",
  authDomain: "prospec-etecc.firebaseapp.com",
  projectId: "prospec-etecc",
  storageBucket: "prospec-etecc.firebasestorage.app",
  messagingSenderId: "1081520313544",
  appId: "1:1081520313544:web:4603eb8a817826f770c1fd"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o Firestore (Banco de dados)
export const db = getFirestore(app);
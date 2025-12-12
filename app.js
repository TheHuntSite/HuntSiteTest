// Firebase imports (MODULE VERSION)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNSd6smxpEtppVuEhtRaC-19XcyPNglP0",
  authDomain: "huntsite-64e23.firebaseapp.com",
  databaseURL: "https://huntsite-64e23-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "huntsite-64e23",
  storageBucket: "huntsite-64e23.firebasestorage.app",
  messagingSenderId: "1063124348808",
  appId: "1:1063124348808:web:c9e835ad82edada18c143d"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* -----------------------------
   FETCH INITIAL STATES
--------------------------------*/
function fetchInitialStatuses() {
  const statusRef = ref(db, "overlayStatus");

  get(statusRef)
    .then(snapshot => {
      if (!snapshot.exists()) {
        console.warn("No overlay data found");
        return;
      }

      updateOverlays(snapshot.val());
    })
    .catch(err => console.error("Firebase read failed:", err));
}

/* -----------------------------
   APPLY STATES TO DOM
--------------------------------*/
function updateOverlays(statuses) {
  document.querySelectorAll(".overlay-item").forEach((overlay, index) => {
    // Firebase is 1-based
    const entry = statuses[index + 1];
    const status = entry?.status ?? 0;

    overlay.style.display = status === 1 ? "block" : "none";

    console.log(`Overlay ${index}: ${status === 1 ? "ON" : "OFF"}`);
  });
}

/* -----------------------------
   WRITE TO FIREBASE
--------------------------------*/
function updateStatusInFirebase(index, status) {
  const statusRef = ref(db, `overlayStatus/${index + 1}`);
  set(statusRef, { status });
}

/* -----------------------------
   CLICK HANDLERS
--------------------------------*/
function addItemClickListeners() {
  document.querySelectorAll(".inventory-item").forEach(item => {
    const index = Number(item.dataset.index);

    item.addEventListener("click", () => {
      const overlay = document.querySelector(
        `.overlay-item[data-index="${index}"]`
      );

      const isVisible = overlay.style.display === "block";
      const newStatus = isVisible ? 0 : 1;

      overlay.style.display = newStatus ? "block" : "none";
      updateStatusInFirebase(index, newStatus);
    });
  });
}

/* -----------------------------
   INIT
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  fetchInitialStatuses();
  addItemClickListeners();
});
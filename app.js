// Firebase imports (MODULAR SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

/* -----------------------------
   FIREBASE CONFIG
--------------------------------*/
const firebaseConfig = {
  apiKey: "AIzaSyDNSd6smxpEtppVuEhtRaC-19XcyPNglP0",
  authDomain: "huntsite-64e23.firebaseapp.com",
  databaseURL: "https://huntsite-64e23-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "huntsite-64e23",
  storageBucket: "huntsite-64e23.firebasestorage.app",
  messagingSenderId: "1063124348808",
  appId: "1:1063124348808:web:c9e835ad82edada18c143d"
};

/* -----------------------------
   INIT FIREBASE
--------------------------------*/
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* -----------------------------
   APPLY STATES TO UI
--------------------------------*/
function updateOverlays(statuses) {
  console.log("[SYNC] Applying overlay states");

  document.querySelectorAll(".overlay-item").forEach((overlay, index) => {
    const entry = statuses?.[index + 1];
    const status = entry?.status ?? 0;

    overlay.style.display = status === 1 ? "block" : "none";
  });
}

/* -----------------------------
   REALTIME DATABASE LISTENER
--------------------------------*/
function listenForOverlayChanges() {
  const statusRef = ref(db, "overlayStatus");

  console.log("[LISTEN] Listening for overlay changes");

  onValue(statusRef, snapshot => {
    if (!snapshot.exists()) {
      console.warn("[LISTEN] No overlay data found");
      return;
    }

    updateOverlays(snapshot.val());
  });
}

/* -----------------------------
   WRITE STATUS TO FIREBASE
--------------------------------*/
function updateStatusInFirebase(index, status) {
  console.log(`[WRITE] index=${index}, status=${status}`);

  const statusRef = ref(db, `overlayStatus/${index + 1}`);
  set(statusRef, { status });
}

/* -----------------------------
   CLICK HANDLERS
--------------------------------*/
function addItemClickListeners() {
  console.log("[INIT] Attaching click handlers");

  document.querySelectorAll(".item-container").forEach(container => {
    const inventoryItem = container.querySelector(".inventory-item");
    const index = Number(inventoryItem.dataset.index);

    container.addEventListener("click", (event) => {
      console.log("[CLICK]", { index, target: event.target });

      const overlay = document.querySelector(
        `.overlay-item[data-index="${index}"]`
      );

      if (!overlay) {
        console.error(`[ERROR] Overlay not found for index ${index}`);
        return;
      }

      const isVisible = overlay.style.display === "block";
      const newStatus = isVisible ? 0 : 1;

      console.log(
        `[TOGGLE] index=${index} ${isVisible ? "ON → OFF" : "OFF → ON"}`
      );

      // Optimistic UI update
      overlay.style.display = newStatus ? "block" : "none";

      updateStatusInFirebase(index, newStatus);
    });
  });
}

/* -----------------------------
   INIT APP
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  console.log("[INIT] DOM ready");

  listenForOverlayChanges();   // Realtime sync
  addItemClickListeners();     // Local interaction
});
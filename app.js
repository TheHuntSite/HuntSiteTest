// Firebase imports (modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

/* -----------------------------
   CONFIG
--------------------------------*/
const ITEM_COUNT = 28;

/* -----------------------------
   FIREBASE CONFIG
--------------------------------*/
const firebaseConfig = {
  apiKey: "AIzaSyC4-REmLiLySPPnvDvHeE3-lUP64iApC-o",
  authDomain: "huntsitetest.firebaseapp.com",
  databaseURL: "https://huntsitetest-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "huntsitetest",
  storageBucket: "huntsitetest.firebasestorage.app",
  messagingSenderId: "738219939866",
  appId: "1:738219939866:web:fa69cbc6d30ffea78f99a3"
};

/* -----------------------------
   INIT FIREBASE
--------------------------------*/
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* -----------------------------
   BUILD INVENTORY GRID
--------------------------------*/
function buildInventoryGrid() {
  const grid = document.getElementById("inventory-grid");

  for (let i = 0; i < ITEM_COUNT; i++) {
    const slot = document.createElement("div");
    slot.className = "inventory-slot";

    const container = document.createElement("div");
    container.className = "item-container";

    const item = document.createElement("img");
    item.src = `inv_${i + 1}.png`;
    item.alt = `Item ${i + 1}`;
    item.className = "inventory-item";
    item.dataset.index = i;
    item.draggable = false;

    const overlay = document.createElement("img");
    overlay.src = "overlay.png";
    overlay.alt = `Overlay ${i + 1}`;
    overlay.className = "overlay-item";
    overlay.dataset.index = i;
    overlay.draggable = false;

    container.appendChild(item);
    container.appendChild(overlay);
    slot.appendChild(container);
    grid.appendChild(slot);
  }
}

/* -----------------------------
   UPDATE UI FROM DATABASE
--------------------------------*/
function updateOverlays(statuses) {
  document.querySelectorAll(".overlay-item").forEach((overlay, index) => {
    const entry = statuses?.[index + 1];
    const status = entry?.status ?? 0;
    overlay.style.display = status === 1 ? "block" : "none";
  });
}

/* -----------------------------
   REALTIME LISTENERS
--------------------------------*/
function listenForOverlayChanges() {
  const statusRef = ref(db, "overlayStatus");

  onValue(statusRef, snapshot => {
    if (!snapshot.exists()) return;
    updateOverlays(snapshot.val());
  });
}

function listenForTeamName() {
  const teamNameRef = ref(db, "siteConfig/teamName");

  onValue(teamNameRef, snapshot => {
    if (!snapshot.exists()) return;

    const teamName = snapshot.val();

    // Update browser tab title
    document.title = teamName;

    // Update visible page title
    const h1 = document.getElementById("team-title");
    if (h1) {
      h1.textContent = teamName;
    }
  });
}

/* -----------------------------
   WRITE STATUS TO FIREBASE
--------------------------------*/
function updateStatusInFirebase(index, status) {
  const statusRef = ref(db, `overlayStatus/${index + 1}`);
  set(statusRef, { status });
}

/* -----------------------------
   CLICK HANDLERS
--------------------------------*/
function addItemClickListeners() {
  document.querySelectorAll(".item-container").forEach(container => {
    const inventoryItem = container.querySelector(".inventory-item");
    const index = Number(inventoryItem.dataset.index);

    container.addEventListener("click", () => {
      const overlay = container.querySelector(".overlay-item");
      if (!overlay) return;

      const isVisible = overlay.style.display === "block";
      const newStatus = isVisible ? 0 : 1;

      // Write only — UI updates via realtime listener
      updateStatusInFirebase(index, newStatus);
    });
  });
}

/* -----------------------------
   INIT
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  buildInventoryGrid();        // Build grid dynamically
  listenForOverlayChanges();   // Live overlay sync
  addItemClickListeners();     // Click interaction
  listenForTeamName();         // Live team name
});
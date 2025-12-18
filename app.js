// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
   CONFIG
--------------------------------*/
const inventoryItems = [
  { image: "inv_1.png", title: "Item 1" },
  { image: "inv_2.png", title: "Item 2" },
  { image: "inv_3.png", title: "Item 3" },
  { image: "inv_4.png", title: "Item 4" },
  { image: "inv_5.png", title: "Item 5" },
  { image: "inv_6.png", title: "Item 6" },
  { image: "inv_7.png", title: "Item 7" },
  { image: "inv_8.png", title: "Item 8" },
  { image: "inv_9.png", title: "Item 9" },
  { image: "inv_10.png", title: "Item 10" },
  { image: "inv_11.png", title: "Item 11" },
  { image: "inv_12.png", title: "Item 12" },
  { image: "inv_13.png", title: "Item 13" },
  { image: "inv_14.png", title: "Item 14" },
  { image: "inv_15.png", title: "Item 15" },
  { image: "inv_16.png", title: "Item 16" },
  { image: "inv_17.png", title: "Item 17" },
  { image: "inv_18.png", title: "Item 18" },
  { image: "inv_19.png", title: "Item 19" },
  { image: "inv_20.png", title: "Item 20" },
  { image: "inv_21.png", title: "Item 21" },
  { image: "inv_22.png", title: "Item 22" },
  { image: "inv_23.png", title: "Item 23" },
  { image: "inv_24.png", title: "Item 24" },
  { image: "inv_25.png", title: "Item 25" },
  { image: "inv_26.png", title: "Item 26" },
  { image: "inv_27.png", title: "Item 27" },
  { image: "inv_28.png", title: "Item 28" }
];

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
  grid.innerHTML = "";

  inventoryItems.forEach((item, index) => {
    const slot = document.createElement("div");
    slot.className = "inventory-slot";

    const container = document.createElement("div");
    container.className = "item-container";

    const inventoryImg = document.createElement("img");
    inventoryImg.src = item.image;
    inventoryImg.className = "inventory-item";
    inventoryImg.dataset.index = index;
    inventoryImg.title = item.title;
    inventoryImg.alt = item.title;

    const overlayImg = document.createElement("img");
    overlayImg.src = "overlay.png";
    overlayImg.className = "overlay-item";
    overlayImg.dataset.index = index;

    container.appendChild(inventoryImg);
    container.appendChild(overlayImg);
    slot.appendChild(container);
    grid.appendChild(slot);
  });
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
    document.title = teamName;

    const h1 = document.getElementById("team-title");
    if (h1) h1.textContent = teamName;
  });
}

/* -----------------------------
   ATOMIC TOGGLE (IMPORTANT)
--------------------------------*/
function toggleOverlayInFirebase(index) {
  const statusRef = ref(db, `overlayStatus/${index + 1}`);

  runTransaction(statusRef, currentData => {
    const currentStatus = currentData?.status ?? 0;
    return { status: currentStatus === 1 ? 0 : 1 };
  });
}

/* -----------------------------
   INPUT HANDLERS (FAST SAFE)
--------------------------------*/
function addItemClickListeners() {
  document.querySelectorAll(".item-container").forEach(container => {
    const inventoryItem = container.querySelector(".inventory-item");
    const index = Number(inventoryItem.dataset.index);

    container.addEventListener("pointerdown", e => {
      e.preventDefault(); // prevents drag/select edge cases
      toggleOverlayInFirebase(index);
    });
  });
}

/* -----------------------------
   INIT
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  buildInventoryGrid();
  listenForOverlayChanges();
  addItemClickListeners();
  listenForTeamName();
});